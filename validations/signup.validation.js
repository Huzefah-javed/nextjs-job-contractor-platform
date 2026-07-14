import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
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
    .min(2, { message: "Region must be at least 2 characters" })
    .trim(),
});
