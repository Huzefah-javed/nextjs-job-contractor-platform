"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { createTransaction } from "@/helpers/escrowApisFunc";
import { Escrow } from "@/schemas/escrow.schema";
import { ProjectPost } from "@/schemas/project.schema";
import { Proposal } from "@/schemas/proposal.schema";
import { users } from "@/schemas/user.schema";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function transactionCreationAction({
  projectId,
  milestones,
  selectedProposalId,
  clientId,
  contractorId,
}) {
  try {
    const res = await authAndGetUser();
    if (!res?.success) {
      return { success: false, message: "Unauthorized access" };
    }

    await dbConnect();
    const [client, contractor] = await Promise.all([
      users.findById(clientId, "email companyEmail"),
      users.findById(contractorId, "email companyEmail"),
    ]);
    const contractorEmail = contractor?.email || contractor?.companyEmail;
    const clientEmail = client?.email || client?.companyEmail;

    if (!clientEmail || !contractorEmail) {
      return { success: false, message: "Client or contractor email missing" };
    }

    const formattedProjectId = new mongoose.Types.ObjectId(projectId);
    const proposalId = new mongoose.Types.ObjectId(selectedProposalId);

    const result = await createTransaction({
      buyerEmail: clientEmail,
      sellerEmail: contractorEmail,
      milestones,
    });

    if (!result?.transactionId) {
      return {
        success: false,
        message: "Failed to generate transaction ID from payment provider",
      };
    }

    const newEscrow = await Escrow.create({
      proposalId,
      projectId: formattedProjectId,
      transactionId: result.transactionId,
      clientNextUrl: result.buyerNextUrl,
      contractorNextUrl: result.sellerNextUrl,
    });
    if (!newEscrow && !newEscrow._id) {
      return {
        success: false,
        message: "Failed to build escrow transaction",
      };
    }

    await Promise.allSettled([
      ProjectPost.findByIdAndUpdate(formattedProjectId, {
        projectPhase: "hiredAwaitingEscrowFulfillment",
        escrowId: newEscrow._id,
      }),
      Proposal.findByIdAndUpdate(proposalId, {
        escrowId: newEscrow._id,
      }),
    ]);
    revalidatePath("/admin/pendingEscrow");

    return {
      success: true,
      message: "Escrow transaction created successfully",
      transactionId: result.transactionId,
    };
  } catch (error) {
    console.error("Error in adminTransactionCreation:");
    console.error("Error in adminTransactionCreation:", error.response);
    // console.error("Error in adminTransactionCreation:", error.message);
    console.error("Error in adminTransactionCreation2:", error.response.data.errors);
    return {
      success: false,
      message:
        error.message ||
        "An unexpected error occurred during transaction creation",
    };
  }
}
