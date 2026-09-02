"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { ProjectPost } from "@/schemas/project.schema";
import { Proposal } from "@/schemas/proposal.schema";
import User from "@/schemas/user.schema";
import mongoose from "mongoose";

export async function getClientPendingEscrowJobs() {
  try {
    const res = await authAndGetUser();
    if (!res.success) return { success: false };
    const userId = new mongoose.Types.ObjectId(res.id);
    await dbConnect();

    const jobs = await ProjectPost.aggregate([
      {
        $match: {
          clientId: userId,
          status: "approved",
          escrowStatus: "pending",
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "proposals",
          localField: "selectedProposalId",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                status: "accepted",
                escrowStatus: "accepted",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "contractorId",
                foreignField: "_id",
                as: "contractorDetails",
              },
            },
            {
              $unwind: {
                path: "$contractorDetails",
              },
            },
          ],
          as: "props",
        },
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "clientId",
      //     foreignField: "_id",
      //     as: "client",
      //   },
      // },
      { $unwind: "$props" },
      // { $unwind: "$client" },
      {
        $project: {
          projectTitle: 1,
          contractorName: "$props.contractorDetails.name",
          proposedBudget: "$props.proposedBudget",
          createdAt: 1,
          escrowStatus: 1,
          transactionId: 1,
        },
      },
    ]);

    // const jobs = await ProjectPost.find({
    //   clientId: userId,
    //   status: "approved",
    //   escrowStatus: "pending",
    // })
    //   .populate({
    //     path: "selectedProposalId",
    //     select: "proposedBudget contractorId",
    //     populate: {
    //       path: "contractorId",
    //       select: "name email",
    //     },
    //   })
    //   .sort({ createdAt: -1 })
    //   .lean();
    console.log("JObs ", jobs);
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
