"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import Message from "@/schemas/message.schema";

export const MessageAction = async (
  chatId,
  message,
  messageType = "message",
) => {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };
  const senderId = res.id;

  try {
    await dbConnect();
    if (messageType === "offerMessage") {
      await Message.create({
        chatId,
        offerMessage: message,
        senderId,
        messageType: "offer",
      });
    } else if (messageType === "message") {
      await Message.create({ chatId, message, senderId });
    }
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
    console.log("response: ", response);
    return { success: true, response: JSON.parse(JSON.stringify(response)) };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const MessageOfferDeclineAction = async (msgId, senderId) => {
  if (!msgId) return false;

  const res = await authAndGetUser();
  if (!res.success) return false;
  if (res.id === senderId)
    return { success: false, message: "you are unable to perform this action" };

  try {
    await dbConnect();
    const updatedMessage = await Message.findByIdAndUpdate(msgId, {
      offerStatus: "decline",
    });

    if (!updatedMessage) return false;
    return { success: true };
  } catch (error) {
    console.log(error);
    return false;
  }
};
