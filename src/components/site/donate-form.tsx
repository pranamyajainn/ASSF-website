"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Lang } from "@/i18n/config";
import { fill, type UI } from "@/i18n/ui";
import { MIN_GIFT, PAYMENT_READY_HOSTS, type Category } from "@/lib/donate/config";
import { EMAIL, giftTotal, MOBILE, newTransactionId, outcomeOf, readPending, startPayment, taxIdKind, writePending } from "@/lib/donate/checkout";

/**
 * The donate form, in the site's own hand and the reader's language. The
 * categories are the Foundation's, as kept in Apna Dharm; the checks are
 * the ones Apna Dharm's own form makes; and the payment itself is handed to
 * Apna Dharm's script, which opens NTT DATA's checkout. Nothing typed here
 * is stored in the browser — Apna Dharm's own form keeps it, PAN included.
 */
type Field = "category" | "amount" | "name" | "mobile" | "email" | "taxId";

const subscribeNothing = () => () => {};
const inr = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const input =
  "w-full border border-ink/30 bg-leaf px-3.5 py-2.5 text-[1.0625rem] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-cinnabar aria-[invalid=true]:border-cinnabar";

export function DonateForm({
  lang,
  t,
  thanksPath,
  bank,
}: {
  lang: Lang;
  t: UI["donate"];
  thanksPath: string;
  bank: { branch: string; account: string; ifsc: string; labels: { bank: string; account: string; ifsc: string } };
}) {
  const [categories, setCategories] = useState<Category[] | null | "loading">("loading");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [updates, setUpdates] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const confirmRef = useRef<HTMLDialogElement>(null);
  // Only where Apna Dharm will serve its payment script (see PAYMENT_READY_HOSTS).
  const ready = useSyncExternalStore(
    subscribeNothing,
    () => PAYMENT_READY_HOSTS.includes(window.location.host),
    () => true,
  );

  useEffect(() => {
    let live = true;
    fetch(`/api/donate/categories?lang=${lang}`)
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as { categories: Category[] | null } | null;
        if (!live) return;
        const list = res.ok && data?.categories?.length ? data.categories : null;
        setCategories(list);
        // One way to give needs no choosing.
        if (list?.length === 1) setCategoryId(list[0].id);
      })
      .catch(() => live && setCategories(null));
    return () => {
      live = false;
    };
  }, [lang]);

  const list = Array.isArray(categories) ? categories : [];
  const category = list.find((c) => c.id === categoryId);
  const total = useMemo(() => giftTotal(category, amount, quantity), [category, amount, quantity]);

  function check(): Partial<Record<Field, string>> {
    const e: Partial<Record<Field, string>> = {};
    if (!category) e.category = t.chooseCategory;
    else if (total < MIN_GIFT) e.amount = category.perUnit || category.fixed ? fill(t.badAmount, { min: MIN_GIFT }) : amount.trim() ? fill(t.badAmount, { min: MIN_GIFT }) : t.required;
    if (!name.trim()) e.name = t.required;
    if (!mobile.trim()) e.mobile = t.required;
    else if (!MOBILE.test(mobile.trim())) e.mobile = t.badMobile;
    if (email.trim() && !EMAIL.test(email.trim())) e.email = t.badEmail;
    if (taxId.trim() && !taxIdKind(taxId)) e.taxId = t.badTaxId;
    return e;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    const found = check();
    setErrors(found);
    const first = (["category", "amount", "name", "mobile", "email", "taxId"] as Field[]).find((f) => found[f]);
    if (first) {
      document.getElementById(first === "category" ? "gift-category-first" : `gift-${first}`)?.focus();
      return;
    }
    // Without a tax id and an address, the Foundation can't issue a tax receipt: say so once.
    if (!taxId.trim() || !address.trim()) {
      confirmRef.current?.showModal();
      return;
    }
    pay();
  }

  async function pay() {
    if (!category) return;
    setBusy(true);
    const txn = newTransactionId();
    const thanksUrl = new URL(`${thanksPath}?txn=${txn}`, window.location.origin).toString();
    writePending(txn, {
      status: "pending",
      amount: total,
      category: category.original,
      lang,
      updates: updates && email.trim() ? { email: email.trim(), name: name.trim() } : null,
    });
    try {
      await startPayment(
        { category, quantity, amount: total, name, mobile: mobile.trim(), email, address, taxId, remarks },
        txn,
        thanksUrl,
        (response) => {
          // Only the checkout's own replies; a failure to start is handled below.
          if (!response || (!response.ndpsResponse && !response.status)) return;
          const { outcome, code } = outcomeOf(response);
          const pending = readPending(txn);
          if (pending) writePending(txn, { ...pending, status: outcome, code });
        },
      );
    } catch {
      setBusy(false);
      setFailure(t.failed);
    }
  }

  const fieldError = (f: Field) =>
    errors[f] ? (
      <span id={`gift-${f}-error`} className="mt-1.5 block text-[0.92rem] text-cinnabar">
        {errors[f]}
      </span>
    ) : null;
  const labelled = (f: Field) => ({
    id: `gift-${f}`,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `gift-${f}-error` : undefined,
  });

  return (
    <div className="grid gap-x-14 gap-y-12 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <form onSubmit={submit} noValidate className="min-w-0 space-y-12" aria-busy={busy}>
        {/* 1 — what the gift is for */}
        <fieldset>
          <legend className="flex items-baseline gap-3 font-display text-[1.45rem] font-medium leading-tight">
            <span className="font-mono text-register text-cinnabar">1</span>
            {t.forLabel}
          </legend>
          {categories === "loading" ? (
            <p className="mt-5 font-mono text-register text-ink-faint" role="status">
              {t.loading}
            </p>
          ) : !list.length ? (
            <p className="mt-5 border-l-2 border-cinnabar pl-4 text-[1.0625rem] leading-relaxed text-ink-soft">{t.unavailable}</p>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t.forLabel} aria-describedby={errors.category ? "gift-category-error" : undefined}>
              {list.map((c, i) => {
                const on = c.id === categoryId;
                return (
                  <label
                    key={c.id}
                    className={`relative flex cursor-pointer flex-col gap-1.5 border px-4 py-4 transition-colors ${
                      on ? "border-cinnabar bg-white/55" : "border-ink/25 hover:border-ink/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={c.id}
                      checked={on}
                      id={i === 0 ? "gift-category-first" : undefined}
                      onChange={() => {
                        setCategoryId(c.id);
                        setQuantity(c.min);
                        setErrors((e) => ({ ...e, category: undefined, amount: undefined }));
                      }}
                      className="peer sr-only"
                    />
                    <span aria-hidden="true" className={`absolute right-3 top-3 size-3 rounded-full border ${on ? "border-cinnabar bg-cinnabar" : "border-ink/40"}`} />
                    <span className="pr-6 font-display text-[1.15rem] leading-snug text-ink">{c.name}</span>
                    <span className="font-mono text-register text-ink-faint">
                      {c.perUnit ? fill(t.perUnit, { amount: inr(c.amount) }) : c.fixed ? fill(t.fixed, { amount: inr(c.amount) }) : t.anyAmount}
                    </span>
                    <span className="pointer-events-none absolute inset-0 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-orpiment" />
                  </label>
                );
              })}
            </div>
          )}
          {fieldError("category")}

          {category ? (
            <div className="mt-6">
              {category.perUnit ? (
                <div>
                  <label htmlFor="gift-amount" className="block text-[1rem] text-ink">
                    {category.unitLabel} <span className="text-ink-faint">— {t.howMany}</span>
                  </label>
                  <div className="mt-2 flex items-stretch">
                    <button
                      type="button"
                      aria-label="−"
                      onClick={() => setQuantity((q) => Math.max(category.min, q - category.step))}
                      className="w-12 border border-ink/30 text-[1.3rem] text-ink hover:border-cinnabar hover:text-cinnabar"
                    >
                      −
                    </button>
                    <input
                      {...labelled("amount")}
                      type="number"
                      inputMode="numeric"
                      min={category.min}
                      max={category.max || undefined}
                      step={category.step}
                      value={quantity}
                      onChange={(e) => {
                        const n = Math.floor(Number(e.target.value) || category.min);
                        setQuantity(Math.max(category.min, category.max ? Math.min(category.max, n) : n));
                      }}
                      className={`${input} w-24 border-x-0 text-center`}
                    />
                    <button
                      type="button"
                      aria-label="+"
                      onClick={() => setQuantity((q) => (category.max ? Math.min(category.max, q + category.step) : q + category.step))}
                      className="w-12 border border-ink/30 text-[1.3rem] text-ink hover:border-cinnabar hover:text-cinnabar"
                    >
                      +
                    </button>
                    <span className="ml-4 self-center font-mono text-register text-ink-soft">
                      × ₹{inr(category.amount)} = <span className="text-ink">₹{inr(total)}</span>
                    </span>
                  </div>
                </div>
              ) : category.fixed ? (
                <p className="font-display text-[1.6rem]">₹{inr(category.amount)}</p>
              ) : (
                <label className="block max-w-[16rem]">
                  <span className="block text-[1rem] text-ink">{t.amount}</span>
                  <span className="relative mt-2 block">
                    <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-[1.2rem] text-ink-soft">
                      ₹
                    </span>
                    <input
                      {...labelled("amount")}
                      type="number"
                      inputMode="decimal"
                      min={MIN_GIFT}
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`${input} pl-8 font-display text-[1.3rem]`}
                    />
                  </span>
                </label>
              )}
              {fieldError("amount")}
            </div>
          ) : null}
        </fieldset>

        {/* 2 — who is giving */}
        <fieldset className="space-y-5">
          <legend className="flex items-baseline gap-3 font-display text-[1.45rem] font-medium leading-tight">
            <span className="font-mono text-register text-cinnabar">2</span>
            {t.steps[1]}
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="block text-[1rem] text-ink">{t.name}</span>
              <input {...labelled("name")} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={`${input} mt-2`} />
              {fieldError("name")}
            </label>
            <label className="block">
              <span className="block text-[1rem] text-ink">{t.mobile}</span>
              <input
                {...labelled("mobile")}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={`${input} mt-2 font-mono tracking-[0.04em]`}
              />
              {errors.mobile ? fieldError("mobile") : <span className="mt-1.5 block text-[0.9rem] text-ink-faint">{t.mobileHint}</span>}
            </label>
            <label className="block">
              <span className="block text-[1rem] text-ink">
                {t.email} <span className="text-ink-faint">({t.optional})</span>
              </span>
              <input {...labelled("email")} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${input} mt-2`} />
              {fieldError("email")}
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-[1rem] text-ink">
                {t.address} <span className="text-ink-faint">({t.optional})</span>
              </span>
              <input id="gift-address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} className={`${input} mt-2`} />
            </label>
            <label className="block">
              <span className="block text-[1rem] text-ink">
                {t.taxId} <span className="text-ink-faint">({t.optional})</span>
              </span>
              <input
                {...labelled("taxId")}
                autoComplete="off"
                maxLength={12}
                value={taxId}
                onChange={(e) => setTaxId(e.target.value.toUpperCase().replace(/\s/g, "").slice(0, 12))}
                className={`${input} mt-2 font-mono uppercase tracking-[0.06em]`}
              />
              {errors.taxId ? fieldError("taxId") : null}
            </label>
            <p className="self-end pb-3 text-[0.92rem] leading-snug text-ink-faint">{t.taxHint}</p>
            <label className="block sm:col-span-2">
              <span className="block text-[1rem] text-ink">
                {t.remarks} <span className="text-ink-faint">({t.optional})</span>
              </span>
              <textarea rows={2} maxLength={300} value={remarks} onChange={(e) => setRemarks(e.target.value)} className={`${input} mt-2 resize-y`} />
            </label>
          </div>
          {email.trim() ? (
            <label className="flex cursor-pointer items-start gap-3 text-[1rem] text-ink-soft">
              <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} className="mt-1 size-4 accent-[var(--color-cinnabar)]" />
              {t.updates}
            </label>
          ) : null}
        </fieldset>

        {/* 3 — payment */}
        <div>
          <p className="flex items-baseline gap-3 font-display text-[1.45rem] font-medium leading-tight">
            <span className="font-mono text-register text-cinnabar">3</span>
            {t.steps[2]}
          </p>
          {!ready ? (
            <p className="mt-5 border-l-2 border-orpiment pl-4 text-[1rem] leading-relaxed text-ink-soft">{t.notHere}</p>
          ) : null}
          <button
            type="submit"
            disabled={busy || !list.length || !ready}
            className="mt-5 inline-flex min-h-[3.25rem] items-center gap-3 bg-cinnabar px-7 text-[1.0625rem] text-leaf transition-colors hover:bg-cinnabar-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? t.opening : category && total >= MIN_GIFT ? `${t.submit} · ₹${inr(total)}` : t.submit}
          </button>
          {failure ? (
            <p role="alert" className="mt-4 border-l-2 border-cinnabar pl-4 text-[1rem] text-cinnabar">
              {failure}
            </p>
          ) : null}
          <p className="mt-5 max-w-[58ch] font-mono text-register leading-relaxed text-ink-faint">{t.secure}</p>
        </div>
      </form>

      <aside className="min-w-0 xl:sticky xl:top-8 xl:self-start">
        <div className="border border-ink/20 bg-white/40 p-6">
          <p className="font-mono text-register text-ink-faint">{t.total}</p>
          <p className="mt-2 font-display text-[2.6rem] leading-none text-ink">{category && total ? `₹${inr(total)}` : "—"}</p>
          {category ? <p className="mt-3 text-[1rem] leading-snug text-ink-soft">{category.name}</p> : null}
          <p className="mt-5 border-t border-ink/15 pt-4 text-[0.92rem] leading-relaxed text-ink-faint">{t.privacy}</p>
        </div>
        <div className="mt-8">
          <p className="font-display text-[1.2rem]">{t.bankHeading}</p>
          <dl className="mt-3 space-y-1 font-mono text-register text-ink-soft">
            {(["branch", "account", "ifsc"] as const).map((k) => (
              <div key={k}>
                <dt className="sr-only">{bank.labels[k === "branch" ? "bank" : k]}</dt>
                <dd>{bank[k]}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-faint">{t.bankNote}</p>
        </div>
      </aside>

      <dialog
        ref={confirmRef}
        className="m-auto w-[min(30rem,calc(100vw-2rem))] border border-ink/20 bg-leaf p-0 text-ink shadow-2xl backdrop:bg-board-deep/60"
        aria-labelledby="gift-notax-title"
      >
        <div className="p-6" style={{ backgroundImage: "var(--fibre)" }}>
          <p id="gift-notax-title" className="font-display text-[1.35rem] leading-snug">
            {t.noTaxTitle}
          </p>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">{t.noTaxBody}</p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                confirmRef.current?.close();
                document.getElementById(taxId.trim() ? "gift-address" : "gift-taxId")?.focus();
              }}
              className="border border-ink/30 px-4 py-2.5 text-[1rem] hover:border-cinnabar hover:text-cinnabar"
            >
              {t.noTaxBack}
            </button>
            <button
              type="button"
              onClick={() => {
                confirmRef.current?.close();
                pay();
              }}
              className="bg-cinnabar px-4 py-2.5 text-[1rem] text-leaf hover:bg-cinnabar-deep"
            >
              {t.noTaxContinue}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
