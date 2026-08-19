export const CURRENCY_CODE = "PKR";

/** Format an amount as Pakistani Rupees, e.g. "PKR 1,299" */
export function formatPKR(amount, decimals = 2) {
  const n = Number(amount);
  if (!Number.isFinite(n)) {
    return `PKR ${Number(0).toFixed(decimals)}`;
  }
  return `PKR ${n.toLocaleString("en-PK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
