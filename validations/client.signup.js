import { z } from "zod";

export const clientRegistrationSchema = z.object({
  name: z.string().min(2, "Representative name is required"),
  companyName: z.string().min(2, "Company name is required"),
  repRole: z.string().min(2, "Role/Title is required"),
  companyEmail: z.string().email("Invalid business email address"),
  phone: z.string().min(7, "Valid phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companySize: z.enum(["1-10", "11-50", "51-200", "200+"]),
  region: z.string().min(2, "Region/State is required"),
  role: z.literal("client"),
  taxId: z.string().min(3, "Tax ID / Registration number is required"),

  companyRegistrationDoc: z.string().url("Invalid company registration URL"),
  companyRegistrationDocPbId: z
    .string()
    .min(1, "Company registration public ID is required"),
  representativeIdDoc: z.string().url("Invalid representative ID URL"),
  representativeIdDocPbId: z
    .string()
    .min(1, "Representative ID public ID is required"),
});
