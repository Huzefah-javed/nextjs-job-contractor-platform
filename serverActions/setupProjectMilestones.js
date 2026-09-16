"use server";

import { ProjectPost } from "@/schemas/project.schema";

export async function setupProjectMilestones(projectId, milestones) {
  try {
    const isSingleDelivery =
      milestones.length === 1 && milestones[0].title === "Full Project Delivery";
    const completionType = isSingleDelivery ? "single" : "milestones";

    const formattedMilestones = milestones.map((milestone) => {
      const numWeeks = parseFloat(milestone.weeks) || 0;
      return {
        title: milestone.title,
        description: milestone.description,
        amount: milestone.amount,
        deadline: `${numWeeks} ${numWeeks === 1 ? "week" : "weeks"}`,
        status: "pending",
      };
    });

    const updatedDocument = await ProjectPost.findByIdAndUpdate(
      projectId,
      {
        completionType: completionType,
        milestoneApproved: "pending",
        milestones: formattedMilestones,
      },
      { new: true }
    );

    if (!updatedDocument) {
      throw new Error("Project not found in the database.");
    }

    return { success: true, message: "Milestones configured successfully!" };
    
  } catch (error) {
    console.error("Error setting up milestones:", error);
    return { success: false, error: error.message };
  }
}