import { z } from "zod";

export const verifyRegistrationSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter a 6-digit approval code"),
});

export type VerifyRegistrationForm = z.infer<typeof verifyRegistrationSchema>;
