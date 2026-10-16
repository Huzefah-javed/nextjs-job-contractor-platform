import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageType: {
      type: String,
      enum: ["message", "offer"],
      default: "message",
    },
    offerMessage: [
      {
        title: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        deadline: {
          type: String,
          required: true,
        },
      },
    ],
    message: {
      type: String,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
