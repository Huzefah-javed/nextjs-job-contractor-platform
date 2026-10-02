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
        "released",
        "refunded",
        "cancelled",
      ],
      default: "termsPending",
    },
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
