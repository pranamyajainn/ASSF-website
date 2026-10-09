import { apnaDharm, type Category, type Outcome } from "./config";

/**
 * The browser's side of a gift: Apna Dharm's payment script is loaded only
 * when a donor presses Pay; the order it creates carries exactly what its
 * own form would send; and how the payment ended is read from the bank's
 * own reply, not assumed.
 */

type PaymentResponse = { success?: boolean; status?: string; message?: string; ndpsResponse?: unknown };
type PaymentSDKType = {
  _autoInit: (isProduction: boolean) => void;
  startPayment: (params: Record<string, unknown>, callback: (r: PaymentResponse) => void, isProduction: boolean, successUrl: string) => Promise<void>;
};

declare global {
  interface Window {
    PaymentSDK?: PaymentSDKType;
  }
}

let loading: Promise<PaymentSDKType> | null = null;

function loadSdk(): Promise<PaymentSDKType> {
  if (window.PaymentSDK) return Promise.resolve(window.PaymentSDK);
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = apnaDharm.sdk;
    script.async = true;
    const timer = setTimeout(() => reject(new Error("The payment service didn't load.")), 20_000);
    script.onload = () => {
      clearTimeout(timer);
      if (window.PaymentSDK) resolve(window.PaymentSDK);
      else reject(new Error("The payment service didn't load."));
    };
    script.onerror = () => {
      clearTimeout(timer);
      loading = null;
      script.remove();
      reject(new Error("The payment service couldn't be reached."));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** Aadhaar numbers carry a Verhoeff check digit. */
const D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];
function verhoeff(digits: string): boolean {
  let c = 0;
  [...digits].reverse().forEach((d, i) => (c = D[c][P[i % 8][Number(d)]]));
  return c === 0;
}

export const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const MOBILE = /^[6-9]\d{9}$/;
export const EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** "pan", "aadhaar", or null for neither (an empty value is neither). */
export function taxIdKind(value: string): "pan" | "aadhaar" | null {
  const v = value.trim().toUpperCase();
  if (PAN.test(v)) return "pan";
  if (/^\d{12}$/.test(v) && verhoeff(v)) return "aadhaar";
  return null;
}

/** The gift as the donor set it: a category, and an amount or a number of units. */
export function giftTotal(category: Category | undefined, amount: string, quantity: number): number {
  if (!category) return 0;
  if (category.perUnit) return category.amount * Math.max(category.min, quantity);
  if (category.fixed) return category.amount;
  const n = Number(amount);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

/** Apna Dharm's own transaction id format. */
export const newTransactionId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/** What a gift in progress keeps in this tab, for the page the donor returns to. */
export type Pending = {
  status: Outcome | "pending";
  amount: number;
  category: string;
  lang: string;
  /** Only when the donor asked for email updates; cleared once reported. */
  updates: { email: string; name: string } | null;
  code?: string;
  reported?: boolean;
};
export const pendingKey = (txn: string) => `assf-gift:${txn}`;

export function readPending(txn: string): Pending | null {
  try {
    return JSON.parse(sessionStorage.getItem(pendingKey(txn)) ?? "null") as Pending | null;
  } catch {
    return null;
  }
}

export function writePending(txn: string, value: Pending) {
  try {
    sessionStorage.setItem(pendingKey(txn), JSON.stringify(value));
  } catch {
    // Storage blocked: the thank-you page falls back to what the address says.
  }
}

/** The bank's own status code, wherever NTT DATA put it in its reply. */
function statusCode(value: unknown, depth = 0): string | null {
  if (!value || typeof value !== "object" || depth > 6) return null;
  for (const [k, v] of Object.entries(value)) {
    if (k === "statusCode" && typeof v === "string") return v;
    const found = statusCode(v, depth + 1);
    if (found) return found;
  }
  return null;
}

/**
 * How the payment ended. Apna Dharm's script calls any reply from the bank
 * a success; the bank's status code says which it was ("OTS0000" is a
 * completed payment). Without a readable code, it is unclear, not a success.
 */
export function outcomeOf(r: PaymentResponse): { outcome: Outcome; code?: string } {
  if (r.status === "cancelled") return { outcome: "cancelled" };
  if (r.status === "timeout") return { outcome: "timeout" };
  let reply = r.ndpsResponse;
  if (typeof reply === "string") {
    try {
      reply = JSON.parse(reply);
    } catch {
      // An encrypted reply: only Apna Dharm can read it.
    }
  }
  const code = statusCode(reply);
  if (code) return code === "OTS0000" ? { outcome: "success", code } : { outcome: "failed", code };
  return { outcome: r.success ? "unclear" : "failed" };
}

export type Details = {
  category: Category;
  quantity: number;
  amount: number;
  name: string;
  mobile: string;
  email: string;
  address: string;
  taxId: string;
  remarks: string;
};

/**
 * Starts the payment. The address bar is first moved to the thank-you page
 * with the transaction's reference: Apna Dharm's script returns the donor to
 * wherever the payment began, and replaces this page with NTT DATA's
 * checkout meanwhile. If the order can't be created, the page is left as it
 * was and the error is thrown.
 */
export async function startPayment(details: Details, txn: string, thanksUrl: string, onResult: (r: PaymentResponse) => void): Promise<void> {
  const sdk = await loadSdk();
  const kind = taxIdKind(details.taxId);
  const id = details.taxId.trim().toUpperCase();
  const amount = String(details.amount).replace(/\.00$/, "");
  // As Apna Dharm's own form builds it (payment-sdk-1.0.8.js, `pay`).
  const params: Record<string, unknown> = {
    customerId: "",
    orderCurrency: "INR",
    vendorId: apnaDharm.vendorId,
    trustId: apnaDharm.trustId,
    mode: "uat",
    address: details.address.trim(),
    donarName: details.name.trim(),
    customerEmail: details.email.trim() || `support+${details.mobile}@apnadharm.com`,
    customerPhone: details.mobile,
    amount,
    orderAmount: amount,
    transactionId: txn,
    categoryId: details.category.id,
    donationRemarks: details.remarks.trim(),
    successUrl: thanksUrl,
    ...(details.category.perUnit ? { quantity: details.quantity } : {}),
    ...(kind === "pan" ? { pan: id } : kind === "aadhaar" ? { aadhaar: id } : {}),
  };
  sdk._autoInit(true);
  const before = window.location.href;
  window.history.replaceState(null, "", thanksUrl);
  try {
    await sdk.startPayment(params, onResult, true, thanksUrl);
  } catch (err) {
    window.history.replaceState(null, "", before);
    const e = err as { code?: number; message?: string };
    throw new Error(e?.message || "The payment couldn't be started.");
  }
  followCheckout(thanksUrl, onResult);
}

const CHECKOUT_ORIGINS = /^https:\/\/([a-z0-9-]+\.atomtech\.in|api\.apnadharm\.com)$/;

/**
 * Apna Dharm's script listens for the checkout's answer only once
 * (`{ once: true }`), so any earlier message — the checkout frame loading,
 * say — uses it up, and a donor who has paid is left on "Please wait…".
 * This listens for the answer too (added after the checkout replaced the
 * page, which clears earlier listeners), keeps it, and takes the donor to
 * the thank-you page. The answer comes from the payment's return page, so
 * Apna Dharm has the result by then.
 */
function followCheckout(thanksUrl: string, onResult: (r: PaymentResponse) => void) {
  let done = false;
  window.addEventListener("message", (event: MessageEvent) => {
    if (done || !(event.origin === window.location.origin || CHECKOUT_ORIGINS.test(event.origin))) return;
    const d = event.data as unknown;
    let reply: PaymentResponse | null = null;
    if (d && typeof d === "object" && (d as { type?: string }).type === "PAYMENT_RESPONSE") reply = (d as { data?: PaymentResponse }).data ?? null;
    else if (d && typeof d === "object" && "ndpsResponse" in d) reply = { success: true, status: "success", ndpsResponse: (d as { ndpsResponse: unknown }).ndpsResponse };
    else if (d === "sessionTimeout") reply = { success: false, status: "timeout" };
    if (!reply || (!reply.ndpsResponse && !reply.status)) return;
    done = true;
    onResult(reply);
    // Apna Dharm's own redirect, when it works, gets there first.
    setTimeout(() => window.location.replace(thanksUrl), 1200);
  });
}
