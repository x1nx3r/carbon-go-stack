// ERP display conventions. Keep formatting in one place so screens cannot
// disagree about money or dates.

/**
 * Money arrives as integer minor units plus a currency code. Never a float
 * on the wire. This helper is safe below 2^53 minor units; use a decimal
 * library if the domain needs larger values.
 */
export function formatMoney(minor: bigint, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(Number(minor) / 100);
}

/** RFC 3339 in, a readable local date out. */
export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}
