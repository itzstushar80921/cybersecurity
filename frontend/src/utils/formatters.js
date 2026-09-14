export const formatCurrency = (amount, currency = "INR") => {
  if (amount === undefined || amount === null) return "₹0";

  if (currency === "USD") {
    // 1 USD = approx 85 INR
    const usd = amount / 85.0;
    if (usd >= 1000000) {
      return `$${(usd / 1000000).toFixed(2)}M`;
    }
    if (usd >= 1000) {
      return `$${(usd / 1000).toFixed(1)}K`;
    }
    return `$${usd.toFixed(0)}`;
  }

  // Indian Rupees (INR) formatting in Lakhs and Crores
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 10000000) {
    // 1 Crore = 10,000,000
    return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    // 1 Lakh = 100,000
    return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1)} K`;
  }
  return `${sign}₹${abs.toFixed(0)}`;
};

export const formatFullNumber = (amount, currency = "INR") => {
  if (amount === undefined || amount === null) return "0";
  const prefix = currency === "INR" ? "₹" : "$";
  const val = currency === "USD" ? amount / 85.0 : amount;
  return `${prefix}${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

export const getRiskBadgeColor = (score) => {
  if (score >= 70) return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  if (score >= 40) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
};

export const getSeverityBadgeColor = (sev) => {
  switch (sev?.toLowerCase()) {
    case "critical":
      return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    case "high":
      return "bg-orange-500/20 text-orange-300 border-orange-500/40";
    case "medium":
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    default:
      return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
  }
};
