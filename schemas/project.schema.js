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
      enum: ["draft", "approved", "reject", "pending", "complete"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectPost =
  mongoose.models.ProjectPost ||
  mongoose.model("ProjectPost", projectPostSchema);
