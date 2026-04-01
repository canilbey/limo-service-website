/** Human-readable labels for extras JSON (includes legacy keys). */
const EXTRA_LABELS: Record<string, string> = {
  rearFaceCarSeat: 'Rearface car seat',
  frontFaceCarSeat: 'Frontface car seat',
  infantSeat: 'Infant seat (legacy)',
  childSeat: 'Child seat (legacy)',
  boosterSeat: 'Booster seat (legacy)',
  extraWaiting: 'Extra waiting time (legacy)',
};

/**
 * Returns non-empty lines like "Frontface car seat: 2" for display in admin / summaries.
 */
export function formatBookingExtrasLines(extras: Record<string, unknown>): string[] {
  const lines: string[] = [];
  for (const [key, val] of Object.entries(extras)) {
    if (typeof val === 'number' && val > 0) {
      const label = EXTRA_LABELS[key] ?? key;
      lines.push(`${label}: ${val}`);
    }
  }
  return lines;
}
