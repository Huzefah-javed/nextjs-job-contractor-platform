import mongoose from "mongoose";

const projectPostSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    projectTitle: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    projectCategory: {
      type: String,
      required: [true, "Project category is required"],
      trim: true,
    },
    projectDescription: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    budgetRange: {
      type: String,
      required: [true, "Budget range is required"],
      trim: true,
    },
    minBudget: {
      type: Number,
      default: 0,
    },
    maxBudget: {
      type: Number,
      default: 0,
    },
    projectDuration: {
      type: String,
      required: [true, "Project duration is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    imageFiles: [
      {
        secureUrl: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    documentFile: {
      secureUrl: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["approved", "reject", "pending"],
      default: "pending",
    },
    projectPhase: {
      type: String,
      enum: ["acceptingProposals", "inProgress", "completed", "cancelled"],
      default: "acceptingProposals",
    },
    selectedProposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
    escrowStatus: {
      type: String,
      enum: [
        "not_initiated",
        "pending",
        "funded",
        "released",
        "refunded",
        "cancelled",
      ],
      default: "not_initiated",
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectPost =
  mongoose.models.ProjectPost ||
  mongoose.model("ProjectPost", projectPostSchema);
