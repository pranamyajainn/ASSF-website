"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { Lang } from "@/i18n/config";
import { fill, type UI } from "@/i18n/ui";
import { MIN_GIFT, PAYMENT_READY_HOSTS, qrGiving, type Category } from "@/lib/donate/config";
import { EMAIL, giftTotal, MOBILE, newTransactionId, outcomeOf, readPending, startPayment, taxIdKind, writePending } from "@/lib/donate/checkout";

/**
 * The donate form, kept as short as giving can be: the gift is chosen in
 * one tap (a number of pages, or any amount), only a name and a WhatsApp
 * number are asked for, and everything else — PAN and address for a tax
 * receipt, email, a note — waits behind a line the donor can open. Nothing
 * pops up. The checks are Apna Dharm's own; the payment is handed to Apna
 * Dharm's script, which opens NTT DATA's checkout. Nothing typed here is
 * stored in the browser.
 *
 * While gifts go by the Foundation's UPI QR code (qrGiving), the same form
 * leaves the donor's details with the Foundation and then shows the QR.
 */
type Field = "category" | "amount" | "name" | "mobile" | "email" | "taxId";

/** Counts offered as one tap, for gifts priced per unit (pages). */
const QUICK = [1, 5, 10, 25];

const subscribeNothing = () => () => {};
const inr = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const input =
  "w-full rounded-md border border-leaf-edge bg-white/55 px-3.5 py-3 text-[1.0625rem] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-cinnabar aria-[invalid=true]:border-cinnabar";
const tile = (on: boolean) =>
  `flex min-h-[5.25rem] cursor-pointer flex-col items-center justify-center rounded-md border px-3 py-3 text-center transition-colors ${
    on ? "border-cinnabar bg-cinnabar text-leaf" : "border-leaf-edge bg-leaf-deep/70 text-ink hover:border-cinnabar/60"
  }`;
const more = "group flex cursor-pointer items-baseline gap-2 text-left text-[1rem] text-cinnabar";
const moreText = "underline decoration-cinnabar/35 underline-offset-[5px] group-hover:decoration-cinnabar";

export function DonateForm({
  lang,
  t,
  thanksPath,
  payee,
}: {
  lang: Lang;
  t: UI["donate"];
  thanksPath: string;
  /** Whose account the QR code pays, as the donor's UPI app will show it. */
  payee: string;
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
  const [qr, setQr] = useState<{ ref: string; amount: number } | null>(null);
  const [copied, setCopied] = useState(false);
  // Only where Apna Dharm will serve its payment script (see PAYMENT_READY_HOSTS); a QR code works anywhere.
  const ready = useSyncExternalStore(
    subscribeNothing,
    () => qrGiving.on || PAYMENT_READY_HOSTS.includes(window.location.host),
    () => true,
  );
  useEffect(() => {
    if (qr) document.getElementById("gift-qr")?.focus();
  }, [qr]);

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
    if (qrGiving.on) {
      const res = await fetch("/api/donate/qr", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amount: total,
          category: category.original,
          quantity: category.perUnit ? quantity : 1,
          name,
          mobile: mobile.trim(),
          email,
          taxId,
          address,
          remarks,
          updates: updates && !!email.trim(),
          lang,
        }),
      }).catch(() => null);
      const data = res?.ok ? ((await res.json().catch(() => null)) as { ref?: string } | null) : null;
      setBusy(false);
      if (data?.ref) setQr({ ref: data.ref, amount: total });
      else setFailure(t.qrFailed);
      return;
    }
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
    } catch (err) {
      // The donor sees a plain message; the reason is kept for whoever opens the console.
      console.error("The payment couldn't start:", err);
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
  const payLabel = qrGiving.on
    ? busy
      ? t.qrOpening
      : t.qrSubmit
    : busy
      ? t.opening
      : category && total >= MIN_GIFT
        ? fill(t.payButton, { amount: inr(total) })
        : t.submit;
  const noTaxNote = !taxId.trim() || !address.trim();
  const disabled = busy || !list.length || !ready;

  if (qr) {
    return (
      <div className="grid items-start gap-x-14 gap-y-8 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <figure className="mx-auto w-full max-w-[17rem] md:mx-0">
          <div className="border border-ink/20 bg-white p-3">
            <Image src={qrGiving.image} alt={`UPI QR code: ${qrGiving.upi}`} width={720} height={720} unoptimized className="block h-auto w-full" />
          </div>
          <a
            href={qrGiving.image}
            download="ASSF-UPI-QR.png"
            className="mt-3 flex min-h-[2.9rem] items-center justify-center border border-ink/30 px-4 text-[1rem] text-ink transition-colors hover:border-cinnabar hover:text-cinnabar"
          >
            {t.qrSave}
          </a>
        </figure>
        <div className="min-w-0">
          <h2 id="gift-qr" tabIndex={-1} className="font-display text-[clamp(1.7rem,1.3rem+1.4vw,2.3rem)] font-medium leading-tight outline-none">
            {fill(t.qrHeading, { amount: inr(qr.amount) })}
          </h2>
          <p className="mt-2 font-mono text-register text-ink-faint">{fill(t.qrPayee, { name: payee })}</p>
          <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink">{fill(t.qrHow, { amount: inr(qr.amount) })}</p>
          <p className="mt-3 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">{t.qrPhone}</p>
          <div className="mt-5 flex max-w-md items-stretch border border-ink/25 bg-white/50">
            <span className="min-w-0 flex-1 px-3.5 py-2.5">
              <span className="block font-mono text-[0.72rem] text-ink-faint">{t.qrUpi}</span>
              <span className="block break-all font-mono text-[1.05rem] text-ink">{qrGiving.upi}</span>
            </span>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard
                  ?.writeText(qrGiving.upi)
                  .then(() => setCopied(true))
                  .catch(() => {})
              }
              className="shrink-0 border-l border-ink/25 px-4 text-[0.95rem] text-cinnabar hover:bg-white/70"
            >
              <span aria-live="polite">{copied ? t.qrCopied : t.qrCopy}</span>
            </button>
          </div>
          <p className="mt-6 max-w-[56ch] border-l-2 border-cinnabar/60 pl-4 text-[1rem] leading-relaxed text-ink">{t.qrAfter}</p>
          <p className="mt-4 font-mono text-register text-ink-faint">
            {t.reference}: {qr.ref}
          </p>
          <button
            type="button"
            onClick={() => {
              setQr(null);
              setCopied(false);
            }}
            className={`${more} mt-6`}
          >
            <span className={moreText}>{t.qrBack}</span>
          </button>
          <p className="mt-8 max-w-[58ch] font-mono text-register leading-relaxed text-ink-faint">{t.qrSecure}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)]">
      <form id="gift-form" onSubmit={submit} noValidate className="min-w-0 space-y-10" aria-busy={busy}>
        {/* The gift: a number of folios in one tap, or any amount */}
        <fieldset>
          <legend className="sr-only">{t.steps[0]}</legend>
          {categories === "loading" ? (
            <p className="font-mono text-register text-ink-faint" role="status">
              {t.loading}
            </p>
          ) : !list.length ? (
            <p className="border-l-2 border-cinnabar pl-4 text-[1.0625rem] leading-relaxed text-ink-soft">{t.unavailable}</p>
          ) : simple && perUnit ? (
            <div>
              <div role="radiogroup" aria-label={perUnit.unitLabel} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                      className={tile(on)}
                    >
                      <span className="font-display text-[1.05rem] font-medium leading-tight">{fill(n === 1 ? t.folioOne : t.folioMany, { n })}</span>
                      <span className={`mt-1.5 font-display text-[1.2rem] font-semibold leading-none ${on ? "text-orpiment" : "text-cinnabar"}`}>₹{inr(perUnit.amount * n)}</span>
                    </button>
                  );
                })}
              </div>
              {custom && category === perUnit ? (
                <p className="mt-3 font-mono text-register text-ink">
                  {fill(quantity === 1 ? t.folioOne : t.folioMany, { n: quantity })} · ₹{inr(perUnit.amount * quantity)}
                </p>
              ) : null}
              {open ? (
                <label className="mt-5 block">
                  <span className="block font-mono text-register text-ink-soft">{t.orAny}</span>
                  <span className="relative mt-2 block">
                    <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-[1.15rem] text-ink-soft">
                      ₹
                    </span>
                    <input
                      {...labelled("amount")}
                      type="number"
                      inputMode="numeric"
                      min={MIN_GIFT}
                      step="1"
                      placeholder={t.amountPlaceholder}
                      value={category === open ? amount : ""}
                      onFocus={() => category !== open && choose(open)}
                      onChange={(e) => {
                        if (category !== open) choose(open);
                        setAmount(e.target.value);
                      }}
                      className={`${input} pl-8`}
                    />
                  </span>
                </label>
              ) : null}
              {fieldError("amount")}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t.forLabel}>
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
                    className={`${tile(on)} !items-start text-left`}
                  >
                    <span className="font-display text-[1.15rem] leading-snug">{c.name}</span>
                    <span className="mt-1 font-mono text-register opacity-80">
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
          <label className="block">
            <span className="block font-mono text-register text-ink-soft">{t.name}</span>
            <input {...labelled("name")} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={`${input} mt-2`} />
            {fieldError("name")}
          </label>
          <label className="block">
            <span className="block font-mono text-register text-ink-soft">{t.mobile}</span>
            <input
              {...labelled("mobile")}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder={t.mobilePlaceholder}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className={`${input} mt-2 font-mono tracking-[0.04em]`}
            />
            {errors.mobile ? fieldError("mobile") : <span className="mt-1.5 block text-[0.92rem] text-ink-soft">{t.mobileHint}</span>}
          </label>

          <div className="divide-y divide-ink/15 border-y border-ink/15">
            <div className="py-3.5">
              <button type="button" aria-expanded={receipt} onClick={() => setReceipt(!receipt)} className={more}>
                <span aria-hidden="true" className="w-3">
                  {receipt ? "−" : "+"}
                </span>
                <span className={moreText}>{t.addReceipt}</span>
              </button>
              {receipt ? (
                <div className="mt-4 grid gap-5">
                  <label className="block">
                    <span className="block font-mono text-register text-ink-soft">{t.taxId}</span>
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
                    <span className="block font-mono text-register text-ink-soft">{t.address}</span>
                    <input id="gift-address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} className={`${input} mt-2`} />
                  </label>
                  <p className="text-[0.92rem] leading-snug text-ink-soft">{t.taxHint}</p>
                </div>
              ) : null}
            </div>

            <div className="py-3.5">
              <button type="button" aria-expanded={extras} onClick={() => setExtras(!extras)} className={more}>
                <span aria-hidden="true" className="w-3">
                  {extras ? "−" : "+"}
                </span>
                <span className={moreText}>{t.addMore}</span>
              </button>
              {extras ? (
                <div className="mt-4 grid gap-5">
                  <label className="block">
                    <span className="block font-mono text-register text-ink-soft">{t.email}</span>
                    <input {...labelled("email")} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${input} mt-2`} />
                    {fieldError("email")}
                  </label>
                  <label className="block">
                    <span className="block font-mono text-register text-ink-soft">{t.remarks}</span>
                    <input maxLength={300} value={remarks} onChange={(e) => setRemarks(e.target.value)} className={`${input} mt-2`} />
                  </label>
                  {email.trim() ? (
                    <label className="flex cursor-pointer items-start gap-3 text-[1rem] text-ink-soft">
                      <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} className="mt-1 size-4 accent-[var(--color-cinnabar)]" />
                      {t.updates}
                    </label>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          {noTaxNote ? <p className="max-w-[58ch] text-[0.9rem] leading-relaxed text-ink-soft">{t.noTaxNote}</p> : null}
        </fieldset>

        {/* On a phone or tablet the button is in the bar at the foot of the screen; what it says back is here. */}
        <div className="space-y-3 lg:hidden">
          {!ready ? <p className="border-l-2 border-orpiment pl-4 text-[1rem] leading-relaxed text-ink-soft">{t.notHere}</p> : null}
          {failure ? (
            <p role="alert" className="border-l-2 border-cinnabar pl-4 text-[1rem] text-cinnabar">
              {failure}
            </p>
          ) : null}
          <p className="max-w-[58ch] text-[0.95rem] leading-relaxed text-ink-soft">{qrGiving.on ? t.qrSecure : t.secure}</p>
          <p className="max-w-[58ch] text-[0.95rem] leading-relaxed text-ink-soft">{qrGiving.on ? t.qrPrivacy : t.privacy}</p>
        </div>
      </form>

      {/* Your gift: the total, the button, and what happens next — beside the form while it scrolls. */}
      <aside className="hidden min-w-0 lg:sticky lg:top-8 lg:block lg:self-start">
        <div className="rounded-xl bg-board p-7 text-board-ink">
          <p className="font-mono text-register uppercase tracking-[0.1em] text-orpiment">{t.total}</p>
          <p className="mt-2 font-display text-[3rem] font-semibold leading-none">{category && total ? `₹${inr(total)}` : "—"}</p>
          {category ? (
            <p className="mt-3 text-[1rem] leading-snug text-board-soft">
              {category.name}
              {category.perUnit ? ` · ${quantity} × ₹${inr(category.amount)}` : ""}
            </p>
          ) : null}
          {!ready ? <p className="mt-5 border-l-2 border-orpiment pl-4 text-[0.95rem] leading-relaxed">{t.notHere}</p> : null}
          <button
            type="submit"
            form="gift-form"
            disabled={disabled}
            className="mt-6 flex min-h-[3.25rem] w-full items-center justify-center bg-cinnabar px-6 text-[1.0625rem] text-leaf transition-colors hover:bg-cinnabar-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {payLabel}
          </button>
          {failure ? (
            <p role="alert" className="mt-4 text-[1rem] text-cinnabar-light">
              {failure}
            </p>
          ) : null}
          <p className="mt-5 text-[0.95rem] leading-relaxed text-board-soft">{qrGiving.on ? t.qrSecure : t.secure}</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-board-soft">{qrGiving.on ? t.qrPrivacy : t.privacy}</p>
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
          {busy ? (qrGiving.on ? t.qrOpening : t.opening) : qrGiving.on ? t.qrPayShort : t.payShort}
        </button>
      </div>
    </div>
  );
}
