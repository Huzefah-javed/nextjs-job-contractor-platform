"use server";

import { authAndGetUser } from "@/helpers/authAndGetUser";
import ChatRoom from "@/schemas/chatRoom.schema";

export const gettingChatsForClients = async () => {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };
  const clientId = res.id;

  try {
    const response = await ChatRoom.find({ clientId })
      .populate("contractorId", "name email")
      .lean();

    return { success: true, response };
  } catch (error) {
    console.log(error);

    return { success: false };
  }
};
