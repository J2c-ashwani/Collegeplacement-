/**
 * Production-Grade Date & Time Formatting Utilities for PlacementConnect.
 *
 * Guarantees:
 * 1. ZERO occurrences of "Invalid Date" or "NaN" in any UI surface.
 * 2. Strict ISO parsing with fallback values.
 * 3. Consistent Indian Standard Time (IST, UTC+05:30) rendering across server,
 *    client browsers, Playwright headless runners, and print/PDF export engines.
 * 4. Deterministic "DD MMM YYYY" output (e.g., "12 Sep 2026").
 */

const IST_TIMEZONE = 'Asia/Kolkata';

export interface DateFormatOptions {
  fallback?: string;
  includeTime?: boolean;
  timeOnly?: boolean;
}

/**
 * Safely parses any input (Date, string, number, null, undefined) into a valid Date or null.
 */
export function safeParseDate(input: unknown): Date | null {
  if (input === null || input === undefined || input === '') {
    return null;
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (typeof input === 'number') {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (
      !trimmed ||
      trimmed === 'Invalid Date' ||
      trimmed === 'undefined' ||
      trimmed === 'null' ||
      trimmed === 'NaN'
    ) {
      return null;
    }
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/**
 * Formats a date safely as DD MMM YYYY (e.g., "12 Sep 2026") in IST.
 * NEVER returns "Invalid Date".
 */
export function formatDate(input: unknown, fallback = 'Date unavailable'): string {
  const d = safeParseDate(input);
  if (!d) return fallback;

  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: IST_TIMEZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(d);
    const day = parts.find((p) => p.type === 'day')?.value || '';
    const monthRaw = parts.find((p) => p.type === 'month')?.value || '';
    const month = monthRaw.replace('Sept', 'Sep');
    const year = parts.find((p) => p.type === 'year')?.value || '';
    return `${day} ${month} ${year}`;
  } catch {
    return fallback;
  }
}

/**
 * Formats a date & time safely as DD MMM YYYY, HH:mm IST (e.g., "30 Sep 2026, 14:30 IST").
 * NEVER returns "Invalid Date".
 */
export function formatDateTime(input: unknown, fallback = 'Schedule unavailable'): string {
  const d = safeParseDate(input);
  if (!d) return fallback;

  try {
    const dateStr = formatDate(d, fallback);
    const timeFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: IST_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const timeStr = timeFormatter.format(d);
    return `${dateStr}, ${timeStr} IST`;
  } catch {
    return fallback;
  }
}

/**
 * Formats time only safely as HH:mm IST (e.g., "14:30 IST").
 */
export function formatTime(input: unknown, fallback = 'Time unavailable'): string {
  const d = safeParseDate(input);
  if (!d) return fallback;

  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: IST_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${formatter.format(d)} IST`;
  } catch {
    return fallback;
  }
}
