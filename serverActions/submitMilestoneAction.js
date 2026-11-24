"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/config/db.config";
import { Escrow } from "@/schemas/escrow.schema";
import { escrowMilestone } from "@/helpers/escrowApisFunc";

export async function submitMilestoneAction(
  escrowId,
  transactionId,
  escrowMilestoneId,
  milestoneId,
  contractorEmail,
) {
  try {
   const res = await escrowMilestone.shipMilestone(
      transactionId,
      escrowMilestoneId,
      contractorEmail,
    );
    await dbConnect();
    const updatedProject = await Escrow.findOneAndUpdate(
      {
        _id: escrowId,
        "milestones._id": milestoneId,
      },
      {
        $set: { "milestones.$.status": "pending" },
      },
      { new: true },
    );

    if (!updatedProject) {
      return { success: false, message: "escrow or milestone not found" };
    }

    revalidatePath("/contractor/projects");

    return { success: true, message: "Milestone submitted successfully" };
  } catch (error) {
    console.error("Error submitting milestone:", error);
    return { success: false, message: "Internal server error" };
  }
}
