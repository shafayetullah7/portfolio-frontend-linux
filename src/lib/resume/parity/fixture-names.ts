export const PARITY_FIXTURE_NAMES = [
  "full",
  "typical",
  "sparse",
  "long",
  "edge",
] as const;

export type ParityFixtureName = (typeof PARITY_FIXTURE_NAMES)[number];

export function parseParityFixtureName(
  raw: string | string[] | undefined,
): ParityFixtureName | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  return (PARITY_FIXTURE_NAMES as readonly string[]).includes(value)
    ? (value as ParityFixtureName)
    : null;
}
