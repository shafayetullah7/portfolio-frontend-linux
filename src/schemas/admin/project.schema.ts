import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z
    .string()
    .min(1, "Slug required")
    .regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens"),
  stack: z.string().min(1, "Stack required"),
  description: z.string().min(1, "Description required"),
  status: z.enum(["active", "wip", "archived"]).optional(),
  repoUrl: z.string().url("Invalid repo URL").or(z.literal("")).optional(),
  docsUrl: z.string().url("Invalid docs URL").or(z.literal("")).optional(),
  buildStatus: z.string().optional(),
  coverage: z.string().optional(),
  sortOrder: z.number().optional(),
  published: z.boolean().optional(),
  screenshotMediaId: z.string().uuid().nullable().optional(),
  features: z.array(z.string()).optional(),
});

export type ProjectForm = z.infer<typeof projectSchema>;
