import assert from 'node:assert/strict';
import { formatDate, formatDateTime, formatTime, safeParseDate } from '../src/lib/date-format.ts';

console.log('Running Dedicated Date & Time Formatting Audit (Zero Invalid Date Guarantee)...');

// 1. Null / Undefined / Empty handling
assert.equal(formatDate(undefined), 'Date unavailable');
assert.equal(formatDate(null), 'Date unavailable');
assert.equal(formatDate(''), 'Date unavailable');
assert.equal(formatDate('Invalid Date'), 'Date unavailable');
assert.equal(formatDate('undefined'), 'Date unavailable');
assert.equal(formatDate(undefined, '12 Sep 2026'), '12 Sep 2026');
console.log('✓ Null, undefined, empty, and corrupt strings gracefully return fallbacks.');

// 2. Exact IST Date Parsing (UTC -> IST)
// 2026-09-12T04:30:00.000Z in UTC is 10:00:00 AM IST on 12 Sep 2026
const utcDate = '2026-09-12T04:30:00.000Z';
const formattedDate = formatDate(utcDate);
assert.equal(formattedDate, '12 Sep 2026');
console.log(`✓ UTC date correctly rendered in IST: ${formattedDate}`);

// 3. Month & Day Boundaries across Midnight
// 2026-09-30T19:00:00.000Z in UTC (+05:30) is 2026-10-01 00:30 IST
const boundaryDate = '2026-09-30T19:00:00.000Z';
const boundaryFormatted = formatDate(boundaryDate);
assert.equal(boundaryFormatted, '01 Oct 2026');
console.log(`✓ Month/day boundary across midnight correctly shifted to IST: ${boundaryFormatted}`);

// 4. DateTime Formatting
const dtFormatted = formatDateTime('2026-09-30T09:00:00.000Z');
// 09:00 UTC + 5:30 = 14:30 IST
assert.equal(dtFormatted, '30 Sep 2026, 14:30 IST');
console.log(`✓ DateTime correctly rendered with IST suffix: ${dtFormatted}`);

// 5. Time Only Formatting
const timeFormatted = formatTime('2026-09-30T09:00:00.000Z');
assert.equal(timeFormatted, '14:30 IST');
console.log(`✓ Time only correctly rendered: ${timeFormatted}`);

console.log('ALL DATE FORMATTING AUDIT TESTS PASSED! ZERO INVALID DATES.');
