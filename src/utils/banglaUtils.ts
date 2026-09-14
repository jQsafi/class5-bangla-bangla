/**
 * Converts English (Western) digits to Bangla digits
 * e.g. 123 → ১২৩
 */
export const englishToBanglaDigits = (n: number | string): string => {
  const digits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(n).replace(/[0-9]/g, d => digits[d] || d);
};

/**
 * Converts Bangla digits to English (Western) digits
 * e.g. ১২৩ → 123
 */
export const banglaToEnglishDigits = (s: string): string => {
  const digits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return s.replace(/[০-৯]/g, d => digits[d] || d);
};
