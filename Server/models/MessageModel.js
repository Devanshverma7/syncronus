import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },
  chatType: {
    type: String,
    enum: ["contact", "channel", "AI"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message =
  mongoose.models.Messages || mongoose.model("Messages", messageSchema);

export default Message;
