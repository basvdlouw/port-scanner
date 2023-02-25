export function portRangeIsValid(start: number, end: number): boolean {
  if (start <= 0 || end >= 65536 || start > end) return false;
  return true;
}

export function sumOfNumbersInArray(array: number[]): number {
  return array.reduce((x: number, y: number) => x + y);
}
