"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { ProjectPost } from "@/schemas/project.schema";
import { Proposal } from "@/schemas/proposal.schema";
import { users } from "@/schemas/user.schema";

export async function getPendingTermsProposals() {
  try {
    const res = await authAndGetUser();
    if (!res.success) return { success: false };
    const contractorId = res.id;
    await dbConnect();
    const proposals = await Proposal.find({
      contractorId: contractorId,
      escrowStatus: "termsPending",
    })
      .populate({
        path: "jobId",
        select: "projectTitle  clientId",
        populate: {
          path: "clientId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .lean();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(proposals)),
    };
  } catch (error) {
    console.error("Error fetching pending terms proposals:", error);
    return {
      success: false,
      message: error.message || "Failed to load pending terms proposals.",
      data: [],
    };
  }
}
