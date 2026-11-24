"use server";

import { dbConnect } from "@/config/db.config";
import { escrowMilestone } from "@/helpers/escrowApisFunc";
import { Escrow } from "@/schemas/escrow.schema";
import { ProjectPost } from "@/schemas/project.schema";

export async function updateMilestoneStatusAction(
  escrowId,
  milestoneId,
  newStatus,
  clientEmail,
  transactionId,
  escrowMilestoneId,
) {
  try {
    const allowedStatuses = ["approved", "underprogress"];
    let normalizedStatus = newStatus?.toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus.toLowerCase())) {
      return { success: false, message: "Invalid status value provided" };
    }
    if (normalizedStatus === "approved") {

      const res = await escrowMilestone.receiveMilestone(
        transactionId,
        escrowMilestoneId,
        clientEmail,
      );
    }

    dbConnect();

    const updateFieldQuery = {
      $set: { "milestones.$.status": newStatus },
    };

    if (normalizedStatus === "approved") {
      updateFieldQuery.$set.milestoneReleaseRequired = true;
    }

    const updatedProject = await Escrow.findOneAndUpdate(
      {
        _id: escrowId,
        "milestones._id": milestoneId,
      },
      updateFieldQuery,
      { new: true },
    );

    if (!updatedProject) {
      return { success: false, message: "Project or milestone not found" };
    }

    return {
      success: true,
      message: `Milestone status successfully updated to ${normalizedStatus}`,
    };
  } catch (error) {
    console.error("Error updating milestone status:", error);
    return { success: false, message: "Internal server error" };
  }
}
