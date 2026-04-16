/** Whole-blood donation cooling window (days) before donor is listed again. */
export const BLOOD_COOLING_DAYS = 120;

export const BLOOD_COOLING_MS = BLOOD_COOLING_DAYS * 24 * 60 * 60 * 1000;

export function bloodCoolingCutoff(): Date {
  return new Date(Date.now() - BLOOD_COOLING_MS);
}

/**
 * Whether a donor should be marked available based solely on last donation date.
 * `null` / missing means never donated — eligible.
 */
export function isAvailableFromLastDonation(
  lastDonation: Date | null | undefined,
): boolean {
  if (lastDonation == null) return true;
  return lastDonation.getTime() <= bloodCoolingCutoff().getTime();
}
