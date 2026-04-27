// GBP Currency Formatting Utility
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const CURRENCY_SYMBOL = '£';
export const CURRENCY_CODE = 'GBP';
