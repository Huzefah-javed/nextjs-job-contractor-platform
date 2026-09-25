"use server";

import { dbConnect } from "@/config/db.config";
import { ProjectPost } from "@/schemas/project.schema";
import { Proposal } from "@/schemas/proposal.schema";
import { users } from "@/schemas/user.schema";

export async function getPendingEscrowProjectsAction() {
  try {
    await dbConnect();

    const projects = await ProjectPost.aggregate([
      {
        $match: {
          projectPhase: "pendingEscrowCreation",
          milestoneApproved: "approved",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "proposals",
          localField: "selectedProposalId",
          foreignField: "_id",
          as: "proposal",
        },
      },
      { $unwind: { path: "$proposal", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "proposal.contractorId",
          foreignField: "_id",
          as: "contractor",
        },
      },
      { $unwind: { path: "$contractor", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          projectId: { $toString: "$_id" },
          projectTitle: { $ifNull: ["$projectTitle", "Untitled Project"] },
          selectedProposalId: { $toString: "$selectedProposalId" },
          clientName: { $ifNull: ["$client.name", "Unknown Client"] },
          clientEmail: { $ifNull: ["$client.email", "$client.companyEmail"] },
          contractorName: {
            $ifNull: ["$contractor.name", "Unknown Contractor"],
          },
          milestones: "$milestones",
          contractorEmail: {
            $ifNull: ["$contractor.email", "$contractor.companyEmail"],
          },
          amount: { $ifNull: ["$proposal.proposedBudget", 0] },
        },
      },
    ]);
    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching pending escrow projects:", error);
    return { success: false, message: "Failed to fetch projects" };
  }
}
