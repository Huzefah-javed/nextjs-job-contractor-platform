import { z } from "zod";

// Single attachment item schema
export const attachmentSchema = z.object({
  secureUrl: z.string().url("Invalid Cloudinary secure URL"),
  publicId: z.string().min(1, "Public ID is required"),
});

export const createProposalSchema = z.object({
  jobId: z
    .string()
    .min(1, "Job ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Job ID format"),

  coverLetter: z
    .string({ required_error: "Cover letter is required" })
    .trim()
    .min(100, "Cover letter must be at least 100 characters long")
    .max(2000, "Cover letter cannot exceed 2000 characters"),

  proposedBudget: z.coerce
    .number({ invalid_type_error: "Budget must be a valid number" })
    .min(1, "Proposed budget must be at least $1"),

  estimatedDuration: z
    .string({ required_error: "Estimated duration is required" })
    .trim()
    .min(1, "Estimated duration cannot be empty"),

  attachments: z.array(attachmentSchema).optional().default([]),
});

export const updateProposalStatusSchema = z.object({
  proposalId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Proposal ID format"),
  status: z.enum(
    ["pending", "shortlisted", "accepted", "rejected", "withdrawn"],
    { message: "Invalid status value" },
  ),
  rejectionReason: z
    .string()
    .trim()
    .max(1000, "Rejection reason cannot exceed 1000 characters")
    .optional(),
});
