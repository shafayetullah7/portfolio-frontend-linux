/**
 * Preview document typography class names (sizes in app.css @theme).
 */

export const modernSplitText = {
  display: "text-resume-modern-display",
  body: "text-resume-modern-body",
  meta: "text-resume-modern-meta",
  section: "text-resume-modern-section",
  pill: "text-resume-modern-pill",
} as const;

export interface ResumeTypography {
  readonly display: string;
  readonly body: string;
  readonly meta: string;
  readonly section: string;
  readonly pill: string;
}

export function sectionHeaderClass(
  typography: ResumeTypography,
  headerSpacing: string,
): string {
  return `${typography.section} font-bold uppercase tracking-wider ${headerSpacing}`;
}

export function pillClass(typography: ResumeTypography): string {
  return `${typography.pill} px-2 py-0.5 rounded border font-medium`;
}
