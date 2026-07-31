"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { uploadToCloud } from "@/helpers/cloud.upload";
import { Proposal } from "@/schemas/proposal.schema";
import {
  createProposalSchema,
  updateProposalStatusSchema,
} from "@/validations/proposal.validation";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function submitProposalAction(prevState, formData) {
  try {
    const res = await authAndGetUser();
    if (!res.success) return { success: false, msg: "UnAuthorized" };

    const contractorId = res.id;

    const uploadResponse = await Promise.all(
      formData.attachments.map((file) => uploadToCloud(file, "proposalFiles")),
    );

    formData.attachments = uploadResponse;

    const validationResult = createProposalSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      console.log("validation validationResult: ", validationResult);

      return {
        success: false,
        errors: fieldErrors,
        message: "Please correct the errors in the form.",
      };
    }

    const validatedData = validationResult.data;

    await dbConnect();

    const existingProposal = await Proposal.findOne({
      jobId: validatedData.jobId,
      contractorId,
    });

    if (existingProposal) {
      return {
        success: false,
        message: "You have already submitted a proposal for this job.",
      };
    }

    await Proposal.create({
      jobId: validatedData.jobId,
      contractorId,
      coverLetter: validatedData.coverLetter,
      proposedBudget: validatedData.proposedBudget,
      estimatedDuration: validatedData.estimatedDuration,
      attachments: validatedData.attachments,
      status: "pending",
    });

    revalidatePath("/contractor/dashboard");

    return {
      success: true,
      message: "Proposal submitted successfully!",
    };
  } catch (error) {
    console.error("Error submitting proposal:", error);
    if (error.code === 11000) {
      return {
        success: false,
        message: "You have already submitted a proposal for this job.",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred while submitting your proposal.",
    };
  }
}

export async function withdrawProposalAction(proposalId) {
  try {
    if (!proposalId || !mongoose.Types.ObjectId.isValid(proposalId)) {
      return { success: false, message: "Invalid Proposal ID format." };
    }

    await dbConnect();
    const objProposalId = new mongoose.Types.ObjectId(proposal);
    const proposal = await Proposal.findById(objProposalId);

    if (!proposal) {
      return { success: false, message: "Proposal not found." };
    }

    if (proposal.status === "accepted" || proposal.status === "rejected") {
      return {
        success: false,
        message: `Cannot withdraw a proposal that is already ${proposal.status}.`,
      };
    }

    proposal.status = "withdrawn";
    await proposal.save();

    revalidatePath("/contractor/dashboard");

    return {
      success: true,
      message: "Proposal successfully withdrawn.",
    };
  } catch (error) {
    console.error("Error withdrawing proposal:", error);
    return { success: false, message: "Failed to withdraw proposal." };
  }
}

export async function updateProposalStatusAction(payload) {
  try {
    const validationResult = updateProposalStatusSchema.safeParse(payload);

    if (!validationResult.success) {
      const errorMsg =
        validationResult.error.errors[0]?.message || "Invalid payload.";
      return { success: false, message: errorMsg };
    }

    const { proposalId, status, rejectionReason } = validationResult.data;

    await connectDB();

    const updateFields = { status };
    if (status === "rejected" && rejectionReason) {
      updateFields.rejectionReason = rejectionReason;
    }

    const objectProposalId = new mongoose.Types.ObjectId(proposalId);

    const updatedProposal = await Proposal.findByIdAndUpdate(objectProposalId, {
      updateFields,
    });

    if (!updatedProposal) {
      return { success: false, message: "Proposal record not found." };
    }

    return {
      success: true,
      message: `Proposal status changed to ${status}.`,
    };
  } catch (error) {
    console.error("Error updating proposal status:", error);
    return { success: false, message: "Failed to update status." };
  }
}
