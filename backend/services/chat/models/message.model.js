import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
    },
    content: String,
    images:[String]
  },
  {
    timeseries: true,
  },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
