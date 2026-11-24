"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import {
  checkCustomerVerification,
  createTransaction,
  getTransactionUsersStatus,
} from "@/helpers/escrowApisFunc";
import { Escrow } from "@/schemas/escrow.schema";
import { ProjectPost } from "@/schemas/project.schema";
import { Proposal } from "@/schemas/proposal.schema";
import { users } from "@/schemas/user.schema";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { setupProjectMilestones } from "./setupProjectMilestones";

export async function transactionCreationAction({
  projectId,
  milestones,
  selectedProposalId,
  senderId,
  clientId,
  contractorId,
}) {
  try {
    const res = await authAndGetUser();
    if (!res?.success) {
      return { success: false, message: "Unauthorized access" };
    }
    if (res.id === senderId)
      return {
        success: false,
        message: "you are unable to perform this action",
      };

    await dbConnect();
    const [client, contractor] = await Promise.all([
      users.findById(clientId, "email companyEmail"),
      users.findById(contractorId, "email companyEmail"),
      Escrow.findOneAndDelete({ projectId }),
    ]);
    const contractorEmail = contractor?.email || contractor?.companyEmail;
    const clientEmail = client?.email || client?.companyEmail;

    if (!clientEmail || !contractorEmail) {
      return { success: false, message: "Client or contractor email missing" };
    }

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

    let allMatched = true;
    for (let i = 0; i < milestones.length; i++) {
      if (
        result.milestones[i] &&
        milestones[i].title === result.milestones[i].title
      ) {
        milestones[i].escrowMilestoneId = result.milestones[i].id;
      } else {
        allMatched = false;
      }
    }

    if (!allMatched) {
      return {
        success: false,
        message: "Failed to generate transaction ID for particular milestone",
      };
    }

    const escrowData = {
      proposalId: selectedProposalId,
      projectId,
      transactionId: result.transactionId,
      clientNextUrl: result.buyerNextUrl,
      contractorNextUrl: result.sellerNextUrl,
      milestones,
      contractorId,
      clientId,
    };

    if (result.buyer_verification_required === false) {
      escrowData.clientEscrowVerified = true;
    }
    if (result.seller_verification_required === false) {
      escrowData.contractorEscrowVerified = true;
    }

    const newEscrow = await Escrow.create(escrowData);
    if (!newEscrow && !newEscrow._id) {
      return {
        success: false,
        message: "Failed to build escrow transaction",
      };
    }

    await Promise.allSettled([
      ProjectPost.findByIdAndUpdate(projectId, {
        projectPhase: "underEscrow",
        escrowId: newEscrow._id,
      }),
      Proposal.findByIdAndUpdate(selectedProposalId, {
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
    console.log(error);
    console.error("Error in adminTransactionCreation:");
    console.error("Error in adminTransactionCreation:", error?.response);
    console.error(
      "Error in adminTransactionCreation2:",
      error?.response?.data?.errors,
    );
    return {
      success: false,
      message:
        error.message ||
        "An unexpected error occurred during transaction creation",
    };
  }
}

export async function verifyCustomerEscrowStatus(transactionId, customerRole) {
  try {
    const result = await getTransactionUsersStatus(transactionId);
    if (customerRole === result.client.role && result.clientEscrowVerified) {
      await Escrow.findOneAndUpdate(
        { transactionId },
        { clientEscrowVerified: true },
      );
      return { success: true, isChange: true };
    }
    if (
      customerRole === result.contractor.role &&
      result.contractorEscrowVerified
    ) {
      await Escrow.findOneAndUpdate(
        { transactionId },
        { contractorEscrowVerified: true },
      );
      return { success: true, isChange: true };
    }

    return { success: true, isChange: false };
  } catch (error) {
    return {
      success: false,
      message:
        error.message ||
        "An unexpected error occurred during status confirming",
    };
  }
}
