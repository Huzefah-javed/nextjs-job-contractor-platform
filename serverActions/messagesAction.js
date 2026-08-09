"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import Message from "@/schemas/message.schema";

export const MessageAction = async (chatId, message) => {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };
  const senderId = res.id;

  try {
    await dbConnect();
    await Message.create({ chatId, message, senderId });
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const MessageLoadAction = async (chatId) => {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };

  try {
    await dbConnect();
    const response = await Message.find({ chatId });
    return { success: true, response };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
