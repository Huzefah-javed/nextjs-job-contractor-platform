"use server";

import { authAndGetUser } from "@/helpers/authAndGetUser";
import ChatRoom from "@/schemas/chatRoom.schema";
import mongoose from "mongoose";

export const chatRoomCreationAction = async (chatInfoObj) => {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };
  chatInfoObj.clientId = res.id;

  const { jobId, contractorId, clientId } = chatInfoObj;

  const isValidJob = jobId && mongoose.Types.ObjectId.isValid(jobId);
  const isValidContractor =
    contractorId && mongoose.Types.ObjectId.isValid(contractorId);
  const isValidClient = clientId && mongoose.Types.ObjectId.isValid(clientId);

  if (!isValidJob || !isValidContractor || !isValidClient) {
    return {
      success: false,
      isValid: false,
      error: "Invalid or missing ObjectId(s) provided.",
    };
  }
  const roomId = `${jobId}-${clientId}-${contractorId}`;

  try {
    const data = await ChatRoom.create({ roomId, clientId, contractorId,  jobId});
    return { success: true, chatId: data._id };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
