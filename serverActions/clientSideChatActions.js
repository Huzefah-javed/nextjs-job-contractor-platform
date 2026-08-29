"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import ChatRoom from "@/schemas/chatRoom.schema";
import Message from "@/schemas/message.schema";
import { users } from "@/schemas/user.schema";
import mongoose from "mongoose";

export const gettingChatsForClients = async () => {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };
  const clientId = new mongoose.Types.ObjectId(res.id);

  try {
    await dbConnect();
    const response = await ChatRoom.aggregate([
      { $match: { clientId } },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "chatId",
          as: "chats",
          pipeline: [
            {
              $facet: {
                unreadMsgCount: [
                  { $match: { read: false, senderId: { $ne: clientId } } },
                  { $count: "count" },
                ],
                lastMsg: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$chats",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: "$chats.lastMsg" },
      {
        $unwind: {
          path: "$chats.unreadMsgCount",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "contractorId",
          foreignField: "_id",
          as: "contractor",
          pipeline: [{ $project: { _id: 1, name: 1 } }],
        },
      },
      { $unwind: "$contractor" },
      {
        $project: {
          contractor: 1,
          clientId: 1,
          roomId: 1,
          chatId: "$_id",
          lastMessage: "$chats.lastMsg.message",
          unreadMessageCount: "$chats.unreadMsgCount.count",
        },
      },
    ]);

    return { success: true, response };
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
};

export const readMsgAction = async (chatId, senderId) => {
  if (!senderId || !chatId) return false;
  try {
    await dbConnect();
    await Message.updateMany(
      { chatId, senderId: { $ne: senderId } },
      { read: true },
    );
    console.log("success ");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
