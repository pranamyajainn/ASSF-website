/**
 * Online giving runs through Apna Dharm, the Foundation's donation system
 * (an ERP for religious trusts): an order is created in the Foundation's
 * Apna Dharm account, the donor pays on NTT DATA Payment Services' checkout
 * (formerly Atom), and the bank reports back to Apna Dharm, which keeps the
 * donor record. This site shows its own form and hands the payment to Apna
 * Dharm's script; it never sees card or bank details.
 *
 * The account is identified by a vendor id and a trust id, which Apna
 * Dharm supplies. They aren't secrets — the payment page has to send them
 * from the browser — so they live here, overridable per environment.
 */
export const apnaDharm = {
  // The account the Foundation's earlier site took gifts with, and the one
  // with its donation categories. (The integration sample named another,
  // 446442 / 6a219c71dcc763cbf8f1b62e, which has no categories yet.)
  vendorId: process.env.NEXT_PUBLIC_APNADHARM_VENDOR_ID || "760021",
  trustId: process.env.NEXT_PUBLIC_APNADHARM_TRUST_ID || "68789be353289298eccba73d",
  /** The SDK version is in the address, so a new release can't change the page unannounced. */
  sdk: "https://api.apnadharm.com/sdk/payment-sdk-1.0.8.js",
  api: "https://api.apnadharm.com/v1/app",
  /** The parent of every donation category in Apna Dharm (as its own SDK asks for them). */
  donationParent: "6332cbba8054b2cac94da3d1",
};

/**
 * Apna Dharm serves its payment script only to the sites it has approved
 * for the Foundation (it answers others "CORS: Host not allowed"): the
 * Foundation's own domain, and localhost:3000 for development. Elsewhere —
 * the vercel.app review address — the form is shown but can't pay, and
 * says why. More hosts: NEXT_PUBLIC_DONATE_HOSTS, comma-separated, once
 * Apna Dharm has approved them.
 */
export const PAYMENT_READY_HOSTS = [
  "shantisagarfoundation.org",
  "www.shantisagarfoundation.org",
  "localhost:3000",
  ...(process.env.NEXT_PUBLIC_DONATE_HOSTS ?? "").split(",").map((h) => h.trim()).filter(Boolean),
];

/** The smallest gift Apna Dharm's checkout accepts. */
export const MIN_GIFT = 10;

/** The donate page and the page a donor returns to, per edition. */
export const DONATE_PATH = "/donate";
export const THANKS_PATH = "/donate/thank-you";

/**
 * Hosts the donate page must be allowed to reach (next.config.ts → its
 * Content-Security-Policy): Apna Dharm's script and API, and the NTT DATA
 * (Atom) checkout it opens.
 */
export const PAYMENT_HOSTS = {
  script: ["https://api.apnadharm.com", "https://psa.atomtech.in"],
  connect: [
    "https://api.apnadharm.com",
    "https://caller.atomtech.in",
    "https://payment.atomtech.in",
    "https://payment1.atomtech.in",
    "https://psa.atomtech.in",
  ],
  frame: ["https://psa.atomtech.in", "https://payment.atomtech.in", "https://payment1.atomtech.in", "https://caller.atomtech.in"],
  media: ["https://apnadharm.com", "https://in.nttdatapay.com", "https://*.atomtech.in"],
};

export type Category = {
  id: string;
  /** The category's name in this edition (Apna Dharm keeps it in English; translated for the others). */
  name: string;
  /** Apna Dharm's own name, as the receipt will say. */
  original: string;
  /** Per unit when `perUnit`; the fixed gift when `fixed`; 0 for any amount. */
  amount: number;
  perUnit: boolean;
  fixed: boolean;
  unitLabel: string;
  min: number;
  max: number;
  step: number;
};

/** A payment's outcome, as the checkout reports it. */
export type Outcome = "success" | "failed" | "cancelled" | "timeout" | "unclear";
