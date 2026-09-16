"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { createTransaction } from "@/helpers/escrowApisFunc";
import { ProjectPost } from "@/schemas/project.schema";
import { Proposal } from "@/schemas/proposal.schema";
import { users } from "@/schemas/user.schema";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function getHiredProjects(filter) {
  try {
    await dbConnect();
    let query = {
      status: "approved",
    };
    if (filter === "awaiting_milestones") {
      query.milestoneApproved = { $in: ["awaitingApproval", "rejected"] };
    } else if (filter === "milestone_ready") {
      query.milestoneApproved = "pending";
    } else if (filter === "completed") {
      query.projectPhase = "completed";
    } else if (filter === "active") {
      query.projectPhase = "active";
    }

    const projects = await ProjectPost.find(query)
      .select(
        "_id projectTitle projectDescription projectCategory projectDuration startDate projectPhase milestoneApproved selectedProposalId milestones createdAt updatedAt",
      )
      .populate({
        path: "selectedProposalId",
        select: "proposedBudget estimatedDuration contractorId status",
      })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      projects: JSON.parse(JSON.stringify(projects)),
    };
  } catch (error) {
    console.error("Error fetching hired projects:", error);
    return { success: false, error: error.message, projects: [] };
  }
}

export async function reviewMilestonesAction({
  projectId,
  milestones,
  jobTitle,
  jobDescription,
  action,
  sellerId,
}) {
  try {
    await dbConnect();
    const res = await authAndGetUser();
    if (!res?.success) return { success: false };
    const buyerId = res.id;
    console.log("res......", res);

    const { email: sellerEmail } = await users.findOne(
      new mongoose.Types.ObjectId(sellerId),
      "email",
    );
    const { companyEmail: buyerEmail } = await users.findOne(
      new mongoose.Types.ObjectId(buyerId),
      "companyEmail",
    );

    const newStatus = action === "approve" ? "approved" : "rejected";
    const objectJobId = new mongoose.Types.ObjectId(projectId);
    if (newStatus === "approved") {
      const { transactionId, nextUrl, milestoneIds } = await createTransaction({
        milestones,
        buyerEmail,
        sellerEmail,
        jobTitle,
        jobDescription,
      });
      const [_, projectJob] = await Promise.all([
        Proposal.updateMany(
          { jobId: objectJobId },
          {
            nextUrl,
            escrowStatus: "termsPending",
            transactionId,
          },
        ),
        ProjectPost.findByIdAndUpdate(objectJobId, {
          transactionId,
          escrowStatus: "pending",
          milestoneApproved: newStatus,
        })
          .select("milestones")
          .lean(),
      ]);
      console.log("projectJob ", projectJob);
      const updatedMilestones = projectJob?.milestones.map((milestone, id) => ({
        ...milestone,
        escrowMilestoneId: milestoneIds[id],
      }));
      console.log("updatedMilestones ", updatedMilestones);
      await ProjectPost.findByIdAndUpdate(objectJobId, {
        milestones: updatedMilestones,
      });
    } else {
      await ProjectPost.findByIdAndUpdate(objectJobId, {
        milestoneApproved: newStatus,
      });
    }

    revalidatePath("/client/hiredProjects");
    return { success: true };
  } catch (error) {
    console.log("Escrow Error Details:", error.response?.data);
    console.log("Escrow Error:", JSON.stringify(error.response?.data, null, 2));
    console.error("Error reviewing milestones:", error);
    return { success: false, error: error.message };
  }
}
