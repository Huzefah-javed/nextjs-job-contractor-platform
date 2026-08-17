import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Job reference is required"],
      index: true,
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Contractor reference is required"],
      index: true,
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      minlength: [100, "Cover letter must be at least 100 characters"],
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
      trim: true,
    },
    proposedBudget: {
      type: Number,
      required: [true, "Proposed budget is required"],
      min: [1, "Budget must be at least 1"],
    },
    estimatedDuration: {
      type: String,
      required: [true, "Estimated duration is required"],
      trim: true,
    },
    attachments: {
      type: [
        {
          secureUrl: { type: String, required: true, trim: true },
          publicId: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "shortlisted", "accepted", "rejected", "withdrawn"],
        message: "Invalid proposal status: {VALUE}",
      },
      default: "pending",
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
    nextUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

proposalSchema.index({ jobId: 1, contractorId: 1 }, { unique: true });

export const Proposal =
mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);
