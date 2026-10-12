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

/** Builder formatDate — YYYY-MM to Mon YYYY; passthrough free text. */
export function formatModernSplitDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!year) return dateStr;
  if (!month) return year;
  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return dateStr;
  return `${MONTHS[monthIndex]} ${year}`;
}

export function formatModernSplitDateRange(
  start: string,
  end: string,
  current: boolean,
): string {
  const startStr = formatModernSplitDate(start);
  const endStr = current ? "Present" : formatModernSplitDate(end);
  return startStr && endStr ? `${startStr} — ${endStr}` : startStr || endStr || "";
}
