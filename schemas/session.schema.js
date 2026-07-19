import { model, models, Schema } from "mongoose";

const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export const sessions = models.session || model("session", sessionSchema);
