import { modernSplitText, type ResumeTypography } from "./documentTypography";

export interface ThemeTokens {
  id: "modern-split";
  accent: string;
  sidebarBg?: string;
  skillsStyle: "comma" | "pills";
  showIcons: boolean;
  typography: ResumeTypography;
  sectionGap: string;
  entryGap: string;
  padding: string;
  sectionHeaderSpacing: string;
  blockGap: string;
  itemGap: string;
  summaryLeading: string;
  contactStackGap: string;
  sidebarSectionGap?: string;
  sidebarItemGap?: string;
  sidebarSectionHeaderSpacing?: string;
  sidebarContactStackGap?: string;
}

export function getSidebarTokens(tokens: ThemeTokens): ThemeTokens {
  return {
    ...tokens,
    sectionGap: tokens.sidebarSectionGap ?? tokens.sectionGap,
    itemGap: tokens.sidebarItemGap ?? tokens.itemGap,
    sectionHeaderSpacing:
      tokens.sidebarSectionHeaderSpacing ?? tokens.sectionHeaderSpacing,
    contactStackGap: tokens.sidebarContactStackGap ?? tokens.contactStackGap,
  };
}

export const modernSplitTokens: ThemeTokens = {
  id: "modern-split",
  accent: "#547690",
  sidebarBg: "bg-[#eef1f4]",
  skillsStyle: "pills",
  showIcons: true,
  typography: modernSplitText,
  sectionGap: "mb-1.5",
  entryGap: "mb-1",
  padding: "p-5",
  sectionHeaderSpacing: "pb-0.5 mb-1.5",
  blockGap: "gap-2",
  itemGap: "gap-1.5",
  summaryLeading: "leading-snug",
  contactStackGap: "gap-1.5",
  sidebarSectionGap: "mb-3",
  sidebarItemGap: "gap-2",
  sidebarSectionHeaderSpacing: "pb-1 mb-2",
  sidebarContactStackGap: "gap-2",
};

export function sectionHeaderStyle(tokens: ThemeTokens): Record<string, string> {
  return {
    color: tokens.accent,
    "border-bottom": `1px solid ${tokens.accent}30`,
  };
}
