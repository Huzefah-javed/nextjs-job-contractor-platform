"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import ChatRoom from "@/schemas/chatRoom.schema";
import mongoose from "mongoose";

export const gettingChatsForContractors = async () => {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };
  const contractorId = res.id;

  const objId = new mongoose.Types.ObjectId(contractorId);

  try {
    await dbConnect();
    const response = await ChatRoom.aggregate([
      { $match: { contractorId: objId } },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "chatId",
          as: "chats",
          pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
        },
      },
      { $unwind: "$chats" },
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $project: {
          roomId: 1,
          _id: 1,
          contractorId: 1,
          client: {
            id: "$client._id",
            name: "$client.name",
            email: "$client.email",
          },
          lastMessage: "$chats.message",
        },
      },
    ]);
    return { success: true, response };
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
};
