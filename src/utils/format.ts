import { UI } from '../constants/index.ts';

export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  return `${UI.currency.symbol}${formatted}`;
};

export const formatNumber = (val: number): string => {
  return new Intl.NumberFormat('th-TH').format(val);
};

export const formatPercent = (val: number): string => {
  return `${val}${UI.units.percent}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  return dateStr;
};
