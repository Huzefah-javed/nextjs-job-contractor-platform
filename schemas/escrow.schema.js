import mongoose from "mongoose";

const escrowSchema = new mongoose.Schema(
  {
    projectEscrowStatus: {
      type: String,
      enum: [
        "not_initiated",
        "pending",
        "payment_sent",
        "payment_approved",
        "released",
        "refunded",
        "cancelled",
      ],
      default: "not_initiated",
    },
    proposalEscrowStatus: {
      type: String,
      enum: ["not_initiated", "termsPending", "accepted"],
      default: "not_initiated",
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
