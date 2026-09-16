"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { Proposal } from "@/schemas/proposal.schema";
import mongoose from "mongoose";

export async function getContractorProjectsAction(phase = "active") {
  try {
    await dbConnect();
    const response = await authAndGetUser();
    if (!response.success) {
      return { success: false, message: "Unauthorized. Please log in." };
    }
    const contractorId = response.id;

    const projectMatch = {
      status: "approved",
    };
    if (phase === "hired") {
      projectMatch.milestoneApproved = {
        $in: ["awaitingApproval", "rejected"],
      };
    }

    if (phase !== "all") {
      projectMatch.projectPhase = phase;
    } else {
      projectMatch.projectPhase = { $in: ["hired", "active", "completed"] };
    }

    const proposalsWithProjects = await Proposal.aggregate([
      {
        $match: {
          contractorId: new mongoose.Types.ObjectId(contractorId),
          status: "accepted",
        },
      },
      {
        $lookup: {
          from: "projectposts",
          localField: "jobId",
          foreignField: "_id",
          pipeline: [{ $match: projectMatch }],
          as: "projectDetails",
        },
      },
      { $unwind: "$projectDetails" },
      {
        $project: {
          _id: 0,
          id: "$projectDetails._id",
          name: "$projectDetails.projectTitle",
          budget: "$proposedBudget",
          projectPhase: "$projectDetails.projectPhase",
          projectActiveAt: "$projectDetails.projectActiveAt",
          duration: "$estimatedDuration",
          milestones: "$projectDetails.milestones",
          milestoneApproved: "$projectDetails.milestoneApproved",
        },
      },
    ]);

    const formattedProjects = proposalsWithProjects.map((project) => {
      const data = {
        id: project.id.toString(),
        name: project.name || "Untitled Project",
        budget: project.budget || "N/A",
        projectPhase: project.projectPhase,
        duration: project.duration,
        deadline: project.projectActive
          ? `${new Date(project.projectActiveAt).toLocaleDateString()} (${project.duration})`
          : "project is not active yet",
      };

      if (project.milestoneApproved === "approved") {
        data.milestones = project.milestones;
      }

      return data;
    });

    return {
      success: true,
      data: formattedProjects,
    };
  } catch (error) {
    console.error("Error fetching contractor projects:", error);
    return {
      success: false,
      message: "Failed to load projects from the database.",
    };
  }
}
