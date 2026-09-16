"use server";

import { revalidatePath } from "next/cache";
import { ProjectPost } from "@/schemas/project.schema";
import { dbConnect } from "@/config/db.config";

export async function submitMilestoneAction(projectId, milestoneId) {
  try {
    await dbConnect();
    const updatedProject = await ProjectPost.findOneAndUpdate(
      {
        _id: projectId,
        "milestones._id": milestoneId,
      },
      {
        $set: { "milestones.$.status": "submitted" },
      },
      { new: true },
    );

    if (!updatedProject) {
      return { success: false, message: "Project or milestone not found" };
    }

    revalidatePath("/contractor/projects");

    return { success: true, message: "Milestone submitted successfully" };
  } catch (error) {
    console.error("Error submitting milestone:", error);
    return { success: false, message: "Internal server error" };
  }
}
