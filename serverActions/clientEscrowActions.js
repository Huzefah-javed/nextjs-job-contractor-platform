"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { ProjectPost } from "@/schemas/project.schema";
import { Proposal } from "@/schemas/proposal.schema";
import User from "@/schemas/user.schema";

export async function getClientPendingEscrowJobs() {
  try {
    const res = await authAndGetUser();
    if (!res.success) return { success: false };
    const userId = res.id;

    await dbConnect();

    const jobs = await ProjectPost.find({
      clientId: userId,
      status: "approved",
      escrowStatus: "pending",
    })
      .populate({
        path: "selectedProposalId",
        select: "proposedBudget contractorId",
        populate: {
          path: "contractorId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(jobs)),
    };
  } catch (error) {
    console.error("Error fetching pending escrow jobs:", error);
    return {
      success: false,
      message: error.message || "Failed to load pending escrow jobs.",
      data: [],
    };
  }
}
