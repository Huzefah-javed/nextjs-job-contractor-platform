import { z } from "zod";

export const contractorSignupSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters" })
    .trim(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  region: z
    .string()
    .min(4, { message: "Region must be at least 4 characters" })
    .trim(),
  country: z
    .string()
    .min(4, { message: "Country must be at least 4 characters" })
    .trim(),
  role: z.enum(["client", "contractor"]),
  specialization: z
    .string()
    .min(4, { message: "Country must be at least 4 characters" })
    .trim(),
  docNumber: z
    .string({
      required_error: "Document or Passport number is required.",
    })
    .trim()
    .transform((val) => val.toUpperCase())
    .refine((val) => val.length >= 4 && val.length <= 15, {
      message: "Document number must be between 4 and 15 characters long.",
    })
    .refine((val) => /^[A-Z0-9]+$/.test(val), {
      message:
        "Document number can only contain letters and numbers (no special characters or spaces).",
    }),
  docFrontLink: z.string().url().trim(),
  docFrontPublicId: z.string().trim(),
  docBackLink: z.string().url().trim(),
  docBackPublicId: z.string().trim(),
});
