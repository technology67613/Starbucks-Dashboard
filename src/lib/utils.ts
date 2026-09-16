import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers into Indian Rupee currency format (e.g., ₹1,31,200)
 */
export function formatINR(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${formatted}`;
}

/**
 * Formats raw numbers using Indian digit grouping
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Formats time from 24h (14:03) to 12h with AM/PM (2:03 PM)
 */
export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let hour = parseInt(hStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${mStr} ${ampm}`;
}

/**
 * Formats date YYYY-MM-DD to readable date like "14 Sep 2025" or "14 Sep"
 */
export function formatDatePretty(dateStr: string, includeYear = true): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(month, 10) - 1;
  const monthName = months[monthIdx] || month;
  return includeYear ? `${parseInt(day, 10)} ${monthName} ${year}` : `${parseInt(day, 10)} ${monthName}`;
}
