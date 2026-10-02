// Indian-style number and currency formatting helpers
export const formatINR = (n, digits = 2) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(n) || 0);

export const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(Number(n) || 0);

export const formatPct = (n) => {
  const v = Number(n) || 0;
  return `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
};

export const formatSigned = (n) => `${n > 0 ? '+' : ''}${formatINR(n)}`;

export const formatDate = (d) =>
  new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatCrore = (n) => `₹${formatNumber(n)} Cr`;

export const shortOrderId = (id) => String(id).slice(-8).toUpperCase();

export const pnlClass = (n) => (n > 0 ? 'text-profit' : n < 0 ? 'text-loss' : 'text-muted');

export const productLabel = (p) => (p === 'INTRADAY' ? 'Intraday' : 'Long-term');
