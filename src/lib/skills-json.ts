import type { Skill } from "~/lib/api/types/portfolio.types";

export function groupSkillsByCategory(skills: Skill[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  for (const skill of skills) {
    const key = skill.category.trim() || "other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(skill.name);
  }
  return grouped;
}
