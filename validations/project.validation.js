import { z } from "zod";

export const projectPostSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),

  projectTitle: z
    .string()
    .min(3, "Project title must be at least 3 characters")
    .max(100, "Project title must not exceed 100 characters")
    .trim(),

  projectCategory: z.string().min(1, "Please select a project category").trim(),

  projectDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),

  budgetRange: z
    .string()
    .min(1, "Please select or specify a budget range")
    .trim(),

  minBudget: z.number().nonnegative().optional().default(0),
  maxBudget: z.number().nonnegative().optional().default(0),

  projectDuration: z.string().min(1, "Project duration is required").trim(),

  location: z.string().min(2, "Location is required").trim(),

  startDate: z.coerce.date({
    invalid_type_error: "Please select a valid start date",
  }),
  imageFiles: z
    .array(
      z.object({
        secureUrl: z.string().url("Invalid image URL"),
        publicId: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
  documentFile: z
    .object({
      secureUrl: z.string().optional().default(""),
      publicId: z.string().optional().default(""),
    })
    .optional()
    .default({ url: "", publicId: "", fileName: "" }),

  status: z
    .enum(["draft", "approved", "reject", "pending", "complete"])
    .default("pending"),
});
