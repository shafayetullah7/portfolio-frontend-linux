/**
 * Print-friendly resume dates (e.g. "Mar 2022 — Present").
 * The public site Experience_Log uses YYYY-MM arrows on purpose — do not reuse that format here.
 */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function parseIsoDate(iso: string): Date | null {
  const trimmed = iso.trim();
  if (!trimmed) return null;
  const d = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

/** e.g. Mar 2022 */
export function formatResumeMonthYear(iso: string | null): string {
  if (!iso) return "";
  const d = parseIsoDate(iso);
  if (!d) return iso.slice(0, 10) || iso;
  const month = MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${month} ${year}`;
}

/** Experience range: Mar 2022 — Present */
export function formatResumeDateRange(
  start: string,
  end: string | null,
  current: boolean,
): string {
  const startLabel = formatResumeMonthYear(start);
  if (!startLabel) return current ? "Present" : "";
  if (current || !end) return `${startLabel} — Present`;
  const endLabel = formatResumeMonthYear(end);
  return endLabel ? `${startLabel} — ${endLabel}` : `${startLabel} — Present`;
}

/** Education: handles null start/end */
export function formatResumeEducationRange(
  start: string | null,
  end: string | null,
): string {
  const startLabel = start ? formatResumeMonthYear(start) : "";
  const endLabel = end ? formatResumeMonthYear(end) : "";
  if (startLabel && endLabel) return `${startLabel} — ${endLabel}`;
  if (startLabel) return startLabel;
  if (endLabel) return endLabel;
  return "";
}

export function formatResumeCertDate(date: string | null): string {
  return formatResumeMonthYear(date);
}
