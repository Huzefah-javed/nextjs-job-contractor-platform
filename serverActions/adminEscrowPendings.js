"use server";

import { dbConnect } from "@/config/db.config";
import { Escrow } from "@/schemas/escrow.schema";
import { Proposal } from "@/schemas/proposal.schema";
import { users } from "@/schemas/user.schema";
import { ProjectPost } from "@/schemas/project.schema";

export async function getPendingEscrowProjectsAction() {
  try {
    await dbConnect();

    const projects = await Escrow.aggregate([
      {
        $match: {
          milestoneReleaseRequired: true,
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
          from: "users",
          localField: "contractorId",
          foreignField: "_id",
          as: "contractor",
        },
      },
      { $unwind: { path: "$contractor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "projectposts",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          milestones: 1,
          transactionId: 1,
          projectTitle: {
            $ifNull: ["$project.projectTitle", "Untitled Project"],
          },
          clientName: { $ifNull: ["$client.name", "Unknown Client"] },
          contractorName: {
            $ifNull: ["$contractor.name", "Unknown Contractor"],
          },
        },
      },
    ]);
    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching pending escrow projects:", error);
    return { success: false, message: "Failed to fetch projects" };
  }
}
