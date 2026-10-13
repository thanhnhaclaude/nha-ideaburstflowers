const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdCents = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const money = (n: number) => (Number.isInteger(n) ? usd.format(n) : usdCents.format(n));
