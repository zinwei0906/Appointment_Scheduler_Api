export const BUSINESS_RULES = {
  DEFAULT_SLOT_DURATION_MINUTES: 30,
  MIN_SLOT_DURATION_MINUTES: 5,
  DEFAULT_MAX_SLOTS: 1,
  MIN_MAX_SLOTS: 1,
  MAX_MAX_SLOTS: 5,
  DEFAULT_OPERATIONAL_START_HOUR: 9,
  DEFAULT_OPERATIONAL_END_HOUR: 18,
  DEFAULT_OPERATIONAL_DAYS: [1, 2, 3, 4, 5], // Monday to Friday
} as const;

export const DAY_NAMES = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
} as const;
