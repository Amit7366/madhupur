/**
 * Build a `tel:` URL for click-to-call. Handles common Bangladesh display formats
 * (leading 0, optional +880, short codes).
 */
export function phoneToTelHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^tel:/i.test(trimmed)) return trimmed;
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 3) return null;
  if (hasPlus) return `tel:+${digits}`;
  if (digits.length <= 5) return `tel:${digits}`;
  if (digits.startsWith("880")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+880${digits.slice(1)}`;
  return `tel:+${digits}`;
}
