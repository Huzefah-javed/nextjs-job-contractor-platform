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

export async function getHiredProjects(filter) {
  try {
    await dbConnect();
    const response = await authAndGetUser();
    if (!response.success) {
      return { success: false, message: "Unauthorized. Please log in." };
    }
    const userId = new mongoose.Types.ObjectId(response.id);
    let query = {};
    if (filter === "active") {
      query.clientEscrowStatus = "payment_approved";
      query.proposalEscrowStatus = "termsAccepted";
    } else if (filter === "escrowPending") {
      query.clientEscrowStatus = {
        $in: ["termsPending", "termsAccepted", "payment_sent"],
      };
    }
    if (response.role === "client") query.clientId = userId;
    if (response.role === "contractor") query.contractorId = userId;
    // query.isProjectCompleted = false;
    console.log(query);
    const projects = await Escrow.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "projectposts",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: {
          path: "$projectId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "proposals",
          localField: "proposalId",
          foreignField: "_id",
          as: "proposal",
        },
      },
      {
        $unwind: {
          path: "$proposalId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          milestones: 1,
          createdAt: 1,
          projectId: {
            _id: "$projectId._id",
            projectTitle: "$projectId.projectTitle",
            projectDescription: "$projectId.projectDescription",
            projectCategory: "$projectId.projectCategory",
          },
          proposalId: {
            _id: "$proposalId._id",
            proposedBudget: "$proposalId.proposedBudget",
            estimatedDuration: "$proposalId.estimatedDuration",
            contractorId: "$proposalId.contractorId",
            status: "$proposalId.status",
          },
        },
      },
    ]);

    return {
      success: true,
      projects: JSON.parse(JSON.stringify(projects)),
    };
  } catch (error) {
    console.error("Error fetching hired projects:", error);
    return { success: false, error: error.message, projects: [] };
  }
}

export async function reviewMilestonesAction({ projectId, action }) {
  try {
    await dbConnect();
    const res = await authAndGetUser();
    if (!res?.success) return { success: false };

    const newStatus = action === "approve" ? "approved" : "rejected";
    const objectJobId = new mongoose.Types.ObjectId(projectId);
    const query = { milestoneApproved: newStatus };
    if (newStatus === "approved") query.projectPhase = "pendingEscrowCreation";

    await ProjectPost.findByIdAndUpdate(objectJobId, query);

    revalidatePath("/client/hiredProjects");
    return { success: true };
  } catch (error) {
    console.log("Escrow Error Details:", error.response?.data);
    console.log("Escrow Error:", JSON.stringify(error.response?.data, null, 2));
    console.error("Error reviewing milestones:", error);
    return { success: false, error: error.message };
  }
}
