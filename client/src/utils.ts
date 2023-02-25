export function portRangeIsValid(start: number, end: number): boolean {
  if (start <= 0 || end >= 65536 || start > end) return false;
  return true;
}
