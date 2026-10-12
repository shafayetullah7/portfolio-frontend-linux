/** Sort list items that expose optional `sortOrder` (default 0). */
export function sortBySortOrder<T extends { sortOrder?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
