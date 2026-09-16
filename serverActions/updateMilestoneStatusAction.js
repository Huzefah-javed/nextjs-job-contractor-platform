"use server";

import { dbConnect } from "@/config/db.config";
import { ProjectPost } from "@/schemas/project.schema";

export async function updateMilestoneStatusAction(
  projectId,
  milestoneId,
  newStatus,
) {
  try {
    dbConnect();

    const allowedStatuses = ["approved", "rejected"];
    let normalizedStatus = newStatus?.toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return { success: false, message: "Invalid status value provided" };
    }

    if (normalizedStatus === "rejected") normalizedStatus = "pending";

    const updatedProject = await ProjectPost.findOneAndUpdate(
      {
        _id: projectId,
        "milestones._id": milestoneId,
      },
      {
        $set: { "milestones.$.status": normalizedStatus },
      },
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
