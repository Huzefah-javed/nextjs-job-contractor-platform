import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectPost",
      required: true,
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

chatRoomSchema.index({ clientId: 1, contractorId: 1 }, { unique: true });

const ChatRoom =
  mongoose.models.ChatRoom || mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
