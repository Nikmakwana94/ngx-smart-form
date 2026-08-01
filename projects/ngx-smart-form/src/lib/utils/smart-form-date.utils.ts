/** Formats a date value for native `<input type="date">` bindings. */
export function formatDateForInput(
  value: Date | string | null | undefined,
): string | null {
  if (value == null || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.length >= 10 ? value.slice(0, 10) : value;
}
