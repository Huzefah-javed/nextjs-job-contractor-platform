import mongoose from "mongoose";

const escrowSchema = new mongoose.Schema(
  {
    clientEscrowStatus: {
      type: String,
      enum: [
        "termsPending",
        "termsAccepted",
        "payment_sent",
        "payment_approved",
        "refunded",
        "cancelled",
      ],
      default: "termsPending",
    },
    milestoneReleaseRequired: {
      type: Boolean,
      default: false,
    },
    isProjectCompleted: {
      type: Boolean,
      default: false,
    },
    milestones: [
      {
        title: {
          type: String,
          required: true,
        },
        escrowMilestoneId: {
          type: String,
        },
        amount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["underProgress", "pending", "completed"],
          default: "underProgress",
        },
        deadline: {
          type: String,
          required: true,
        },
      },
    ],
    proposalEscrowStatus: {
      type: String,
      enum: ["termsPending", "termsAccepted"],
      default: "termsPending",
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectPost",
      default: null,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    clientNextUrl: {
      type: String,
      default: null,
    },
    contractorNextUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Escrow =
  mongoose.models.Escrow || mongoose.model("Escrow", escrowSchema);
