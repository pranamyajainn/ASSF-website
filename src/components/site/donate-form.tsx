"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { Lang } from "@/i18n/config";
import { fill, type UI } from "@/i18n/ui";
import { MIN_GIFT, PAYMENT_READY_HOSTS, type Category } from "@/lib/donate/config";
import { EMAIL, giftTotal, MOBILE, newTransactionId, outcomeOf, readPending, startPayment, taxIdKind, writePending } from "@/lib/donate/checkout";

/**
 * The donate form, kept as short as giving can be: the gift is chosen in
 * one tap (a number of pages, or any amount), only a name and a WhatsApp
 * number are asked for, and everything else — PAN and address for a tax
 * receipt, email, a note — waits behind a line the donor can open. Nothing
 * pops up. The checks are Apna Dharm's own; the payment is handed to Apna
 * Dharm's script, which opens NTT DATA's checkout. Nothing typed here is
 * stored in the browser.
 */
type Field = "category" | "amount" | "name" | "mobile" | "email" | "taxId";

/** Counts offered as one tap, for gifts priced per unit (pages). */
const QUICK = [1, 5, 10, 25];

const subscribeNothing = () => () => {};
const inr = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const input =
  "w-full border border-ink/30 bg-leaf px-3.5 py-2.5 text-[1.0625rem] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-cinnabar aria-[invalid=true]:border-cinnabar";
const chip = (on: boolean) =>
  `flex min-h-[4.25rem] cursor-pointer flex-col items-center justify-center border px-3 py-2 text-center transition-colors ${
    on ? "border-cinnabar bg-white/60 text-ink" : "border-ink/25 text-ink-soft hover:border-ink/50 hover:text-ink"
  }`;
const more = "group flex cursor-pointer items-baseline gap-2 text-left text-[1rem] text-cinnabar";
const moreText = "underline decoration-cinnabar/35 underline-offset-[5px] group-hover:decoration-cinnabar";

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
  const [custom, setCustom] = useState(false);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [updates, setUpdates] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [extras, setExtras] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
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
        if (!list) return;
        // A link can bring the choice with it: /donate?pages=5, /donate?amount=1000.
        const params = new URLSearchParams(window.location.search);
        const pages = Math.floor(Number(params.get("pages")));
        const given = Number(params.get("amount"));
        const unit = list.find((c) => c.perUnit);
        const any = list.find((c) => !c.perUnit && !c.fixed);
        if ((given >= MIN_GIFT || params.has("amount")) && any) {
          setCategoryId(any.id);
          if (given >= MIN_GIFT) setAmount(String(Math.round(given)));
        } else if (unit) {
          setCategoryId(unit.id);
          const n = pages >= unit.min ? pages : unit.min;
          setQuantity(unit.max ? Math.min(unit.max, n) : n);
          setCustom(pages > 0 && !QUICK.includes(pages));
        } else if (list.length === 1) setCategoryId(list[0].id);
      })
      .catch(() => live && setCategories(null));
    return () => {
      live = false;
    };
  }, [lang]);

  const list = Array.isArray(categories) ? categories : [];
  const category = list.find((c) => c.id === categoryId);
  const total = useMemo(() => giftTotal(category, amount, quantity), [category, amount, quantity]);
  const perUnit = list.find((c) => c.perUnit);
  const open = list.find((c) => !c.perUnit && !c.fixed);
  // The usual shape — a gift by count, and any amount — reads as one choice; anything else as cards.
  const simple = !!perUnit && list.every((c) => c === perUnit || c === open);

  function check(): Partial<Record<Field, string>> {
    const e: Partial<Record<Field, string>> = {};
    if (!category) e.category = t.chooseCategory;
    else if (total < MIN_GIFT) e.amount = !category.perUnit && !category.fixed && !amount.trim() ? t.required : fill(t.badAmount, { min: MIN_GIFT });
    if (!name.trim()) e.name = t.required;
    if (!mobile.trim()) e.mobile = t.required;
    else if (!MOBILE.test(mobile.trim())) e.mobile = t.badMobile;
    if (email.trim() && !EMAIL.test(email.trim())) e.email = t.badEmail;
    if (taxId.trim() && !taxIdKind(taxId)) e.taxId = t.badTaxId;
    return e;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    const found = check();
    setErrors(found);
    const first = (["category", "amount", "name", "mobile", "email", "taxId"] as Field[]).find((f) => found[f]);
    if (first) {
      if (first === "taxId") setReceipt(true);
      if (first === "email") setExtras(true);
      setTimeout(() => {
        const el = document.getElementById(`gift-${first}`);
        el?.scrollIntoView({ block: "center" });
        el?.focus({ preventScroll: true });
      }, 0);
      return;
    }
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
  const choose = (c: Category, n?: number) => {
    setCategoryId(c.id);
    if (n !== undefined) setQuantity(n);
    setErrors((e) => ({ ...e, category: undefined, amount: undefined }));
  };
  const payLabel = busy ? t.opening : category && total >= MIN_GIFT ? fill(t.payButton, { amount: inr(total) }) : t.submit;
  const noTaxNote = !taxId.trim() || !address.trim();
  const disabled = busy || !list.length || !ready;

  return (
    <div className="grid gap-x-14 gap-y-12 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <form id="gift-form" onSubmit={submit} noValidate className="min-w-0 space-y-10" aria-busy={busy}>
        {/* The gift */}
        <fieldset>
          <legend className="font-display text-[1.45rem] font-medium leading-tight">{t.steps[0]}</legend>
          {categories === "loading" ? (
            <p className="mt-5 font-mono text-register text-ink-faint" role="status">
              {t.loading}
            </p>
          ) : !list.length ? (
            <p className="mt-5 border-l-2 border-cinnabar pl-4 text-[1.0625rem] leading-relaxed text-ink-soft">{t.unavailable}</p>
          ) : simple && perUnit ? (
            category && category === open ? (
              <div className="mt-5">
                <label className="block max-w-[16rem]">
                  <span className="block text-[1rem] text-ink">{t.amount}</span>
                  <span className="relative mt-2 block">
                    <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-[1.2rem] text-ink-soft">
                      ₹
                    </span>
                    <input
                      {...labelled("amount")}
                      type="number"
                      inputMode="numeric"
                      min={MIN_GIFT}
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`${input} pl-8 font-display text-[1.3rem]`}
                    />
                  </span>
                </label>
                {fieldError("amount")}
                <button type="button" onClick={() => choose(perUnit)} className={`${more} mt-4`}>
                  <span className={moreText}>{fill(t.orUnits, { name: perUnit.name, amount: inr(perUnit.amount) })}</span>
                </button>
              </div>
            ) : (
              <div className="mt-5">
                <p className="text-[1rem] text-ink">
                  {perUnit.name} <span className="text-ink-faint">· {fill(t.perUnit, { amount: inr(perUnit.amount) })}</span>
                </p>
                <div role="radiogroup" aria-label={perUnit.unitLabel} className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {QUICK.filter((n) => n >= perUnit.min && (!perUnit.max || n <= perUnit.max)).map((n, i) => {
                    const on = category === perUnit && !custom && quantity === n;
                    return (
                      <button
                        key={n}
                        id={i === 0 ? "gift-category" : undefined}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => {
                          setCustom(false);
                          choose(perUnit, n);
                        }}
                        className={chip(on)}
                      >
                        <span className="font-display text-[1.5rem] leading-none">{n}</span>
                        <span className="mt-1 font-mono text-[0.72rem] text-ink-faint">₹{inr(perUnit.amount * n)}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={category === perUnit && custom}
                    onClick={() => {
                      setCustom(true);
                      choose(perUnit);
                    }}
                    className={chip(category === perUnit && custom)}
                  >
                    <span className="text-[1rem] leading-tight">{t.other}</span>
                  </button>
                </div>
                <p className="mt-2 font-mono text-[0.72rem] text-ink-faint">{perUnit.unitLabel}</p>
                {custom && category === perUnit ? (
                  <div className="mt-4 flex items-stretch">
                    <button
                      type="button"
                      aria-label="−"
                      onClick={() => setQuantity((q) => Math.max(perUnit.min, q - perUnit.step))}
                      className="w-12 border border-ink/30 text-[1.3rem] text-ink hover:border-cinnabar hover:text-cinnabar"
                    >
                      −
                    </button>
                    <input
                      {...labelled("amount")}
                      type="number"
                      inputMode="numeric"
                      aria-label={perUnit.unitLabel}
                      min={perUnit.min}
                      max={perUnit.max || undefined}
                      step={perUnit.step}
                      value={quantity}
                      onChange={(e) => {
                        const n = Math.floor(Number(e.target.value) || perUnit.min);
                        setQuantity(Math.max(perUnit.min, perUnit.max ? Math.min(perUnit.max, n) : n));
                      }}
                      className={`${input} w-24 border-x-0 text-center font-display text-[1.25rem]`}
                    />
                    <button
                      type="button"
                      aria-label="+"
                      onClick={() => setQuantity((q) => (perUnit.max ? Math.min(perUnit.max, q + perUnit.step) : q + perUnit.step))}
                      className="w-12 border border-ink/30 text-[1.3rem] text-ink hover:border-cinnabar hover:text-cinnabar"
                    >
                      +
                    </button>
                  </div>
                ) : null}
                {fieldError("amount")}
                {open ? (
                  <button type="button" onClick={() => choose(open)} className={`${more} mt-5`}>
                    <span className={moreText}>{t.orAny}</span>
                  </button>
                ) : null}
              </div>
            )
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t.forLabel}>
              {list.map((c, i) => {
                const on = c.id === categoryId;
                return (
                  <button
                    key={c.id}
                    id={i === 0 ? "gift-category" : undefined}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => choose(c, c.min)}
                    className={`flex flex-col items-start gap-1.5 border px-4 py-4 text-left transition-colors ${
                      on ? "border-cinnabar bg-white/55" : "border-ink/25 hover:border-ink/50"
                    }`}
                  >
                    <span className="font-display text-[1.15rem] leading-snug text-ink">{c.name}</span>
                    <span className="font-mono text-register text-ink-faint">
                      {c.perUnit ? fill(t.perUnit, { amount: inr(c.amount) }) : c.fixed ? fill(t.fixed, { amount: inr(c.amount) }) : t.anyAmount}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {fieldError("category")}
          {!simple && category && !category.perUnit && !category.fixed ? (
            <label className="mt-5 block max-w-[16rem]">
              <span className="block text-[1rem] text-ink">{t.amount}</span>
              <input {...labelled("amount")} type="number" inputMode="numeric" min={MIN_GIFT} value={amount} onChange={(e) => setAmount(e.target.value)} className={`${input} mt-2`} />
              {fieldError("amount")}
            </label>
          ) : null}
        </fieldset>

        {/* The giver: two things asked; the rest on request */}
        <fieldset className="space-y-5">
          <legend className="font-display text-[1.45rem] font-medium leading-tight">{t.steps[1]}</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
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
              {errors.mobile ? fieldError("mobile") : <span className="mt-1.5 block text-[0.88rem] text-ink-faint">{t.mobileHint}</span>}
            </label>
          </div>

          <div className="space-y-4 border-t border-ink/15 pt-4">
            <button type="button" aria-expanded={receipt} onClick={() => setReceipt(!receipt)} className={more}>
              <span aria-hidden="true" className="w-3">
                {receipt ? "−" : "+"}
              </span>
              <span className={moreText}>{t.addReceipt}</span>
            </button>
            {receipt ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="block text-[1rem] text-ink">{t.taxId}</span>
                  <input
                    {...labelled("taxId")}
                    autoComplete="off"
                    maxLength={12}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value.toUpperCase().replace(/\s/g, "").slice(0, 12))}
                    className={`${input} mt-2 font-mono uppercase tracking-[0.06em]`}
                  />
                  {fieldError("taxId")}
                </label>
                <label className="block">
                  <span className="block text-[1rem] text-ink">{t.address}</span>
                  <input id="gift-address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} className={`${input} mt-2`} />
                </label>
                <p className="text-[0.9rem] leading-snug text-ink-faint sm:col-span-2">{t.taxHint}</p>
              </div>
            ) : null}

            <button type="button" aria-expanded={extras} onClick={() => setExtras(!extras)} className={more}>
              <span aria-hidden="true" className="w-3">
                {extras ? "−" : "+"}
              </span>
              <span className={moreText}>{t.addMore}</span>
            </button>
            {extras ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="block text-[1rem] text-ink">{t.email}</span>
                  <input {...labelled("email")} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${input} mt-2`} />
                  {fieldError("email")}
                </label>
                <label className="block">
                  <span className="block text-[1rem] text-ink">{t.remarks}</span>
                  <input maxLength={300} value={remarks} onChange={(e) => setRemarks(e.target.value)} className={`${input} mt-2`} />
                </label>
                {email.trim() ? (
                  <label className="flex cursor-pointer items-start gap-3 text-[1rem] text-ink-soft sm:col-span-2">
                    <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} className="mt-1 size-4 accent-[var(--color-cinnabar)]" />
                    {t.updates}
                  </label>
                ) : null}
              </div>
            ) : null}
          </div>
        </fieldset>

        {/* Pay */}
        <div>
          {!ready ? <p className="mb-5 border-l-2 border-orpiment pl-4 text-[1rem] leading-relaxed text-ink-soft">{t.notHere}</p> : null}
          <button
            type="submit"
            disabled={disabled}
            className="hidden min-h-[3.25rem] items-center bg-cinnabar px-7 text-[1.0625rem] text-leaf transition-colors hover:bg-cinnabar-deep disabled:cursor-not-allowed disabled:opacity-50 lg:inline-flex"
          >
            {payLabel}
          </button>
          {failure ? (
            <p role="alert" className="mt-4 border-l-2 border-cinnabar pl-4 text-[1rem] text-cinnabar">
              {failure}
            </p>
          ) : null}
          {noTaxNote ? <p className="mt-4 max-w-[58ch] text-[0.9rem] leading-relaxed text-ink-faint">{t.noTaxNote}</p> : null}
          <p className="mt-3 max-w-[58ch] font-mono text-register leading-relaxed text-ink-faint">{t.secure}</p>
        </div>
      </form>

      <aside className="min-w-0 xl:sticky xl:top-8 xl:self-start">
        <div className="hidden border border-ink/20 bg-white/40 p-6 xl:block">
          <p className="font-mono text-register text-ink-faint">{t.total}</p>
          <p className="mt-2 font-display text-[2.6rem] leading-none text-ink">{category && total ? `₹${inr(total)}` : "—"}</p>
          {category ? (
            <p className="mt-3 text-[1rem] leading-snug text-ink-soft">
              {category.name}
              {category.perUnit ? ` · ${quantity} × ₹${inr(category.amount)}` : ""}
            </p>
          ) : null}
          <p className="mt-5 border-t border-ink/15 pt-4 text-[0.9rem] leading-relaxed text-ink-faint">{t.privacy}</p>
        </div>
        <div className="xl:mt-8">
          <p className="font-display text-[1.15rem]">{t.bankHeading}</p>
          <dl className="mt-3 space-y-1 font-mono text-register text-ink-soft">
            {(["branch", "account", "ifsc"] as const).map((k) => (
              <div key={k}>
                <dt className="sr-only">{bank.labels[k === "branch" ? "bank" : k]}</dt>
                <dd>{bank[k]}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-faint">{t.bankNote}</p>
        </div>
      </aside>

      {/* On a phone or tablet the gift and its button stay in reach while the form scrolls. */}
      <div data-pay-bar className="on-dark fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-black/30 bg-board px-4 py-3 text-board-ink lg:hidden">
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[0.68rem] text-board-soft">{t.total}</span>
          <span className="block font-display text-[1.35rem] leading-tight">{category && total ? `₹${inr(total)}` : "—"}</span>
        </span>
        <button
          type="submit"
          form="gift-form"
          disabled={disabled}
          className="min-h-[2.9rem] shrink-0 bg-cinnabar px-5 text-[1rem] text-leaf transition-colors hover:bg-cinnabar-deep disabled:opacity-50"
        >
          {busy ? t.opening : t.payShort}
        </button>
      </div>
    </div>
  );
}
