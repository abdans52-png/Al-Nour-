import { Currency } from '../types';

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; label: string; name: string }> = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)', name: 'Indian Rupee' },
  USD: { symbol: '$', rate: 1, label: 'USD ($)', name: 'US Dollar' },
  AED: { symbol: 'AED ', rate: 1, label: 'AED (د.إ)', name: 'UAE Dirham' },
  SAR: { symbol: 'SAR ', rate: 1, label: 'SAR (ر.س)', name: 'Saudi Riyal' },
  GBP: { symbol: '£', rate: 1, label: 'GBP (£)', name: 'British Pound' },
  EUR: { symbol: '€', rate: 1, label: 'EUR (€)', name: 'Euro' },
  PKR: { symbol: 'Rs ', rate: 1, label: 'PKR (Rs)', name: 'Pakistani Rupee' }
};

export function formatPrice(amountInUSD: number, currency: Currency | string = 'INR'): string {
  const curKey = (currency as Currency) in CURRENCY_RATES ? (currency as Currency) : 'INR';
  const info = CURRENCY_RATES[curKey] || CURRENCY_RATES.INR;
  const converted = Math.round(amountInUSD * info.rate);
  
  if (curKey === 'INR') {
    return `${info.symbol}${converted.toLocaleString('en-IN')}`;
  }
  if (curKey === 'PKR') {
    return `${info.symbol}${converted.toLocaleString('en-PK')}`;
  }
  return `${info.symbol}${converted.toLocaleString('en-US')}`;
}
