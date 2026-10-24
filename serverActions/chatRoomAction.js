"use server";

import { authAndGetUser } from "@/helpers/authAndGetUser";
import ChatRoom from "@/schemas/chatRoom.schema";
import mongoose from "mongoose";

export const chatRoomCreationAction = async (chatInfoObj) => {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };
  chatInfoObj.clientId = res.id;

  const { jobId, contractorId, clientId, proposalId } = chatInfoObj;

  const isValidJob = jobId && mongoose.Types.ObjectId.isValid(jobId);
  const isValidContractor =
    contractorId && mongoose.Types.ObjectId.isValid(contractorId);
  const isValidClient = clientId && mongoose.Types.ObjectId.isValid(clientId);
  const isValidProposal =
    proposalId && mongoose.Types.ObjectId.isValid(proposalId);

  if ((!isValidJob || !isValidContractor || !isValidClient, !isValidProposal)) {
    return {
      success: false,
      isValid: false,
      error: "Invalid or missing ObjectId(s) provided.",
    };
  }
  const roomId = `${jobId}-${clientId}-${contractorId}`;

  try {
    const data = await ChatRoom.create({
      roomId,
      clientId,
      contractorId,
      jobId,
      proposalId,
    });
    return { success: true, chatId: data._id };
  } catch (error) {
    if (error.code === 11000) {
      const data = await ChatRoom.findOne({ roomId });
      return { success: true, chatId: data._id };
    }
    console.log(error);
    return { success: false };
  }
};
