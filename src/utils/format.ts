export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatInteger(val: number): string {
  return new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: 0,
  }).format(val);
}
