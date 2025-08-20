import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    postId:   { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text:     { type: String, required: true, maxlength: 2000 },

    // for replies
    parentId:       { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    parentUsername: { type: String, default: null }, // for display of whom this message replied to
    parentText:     { type: String, default: null }  // for displaying message that is being replied
  },
  { timestamps: true }
);

export interface IMessage extends mongoose.Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  text: string;
  parentId?: mongoose.Types.ObjectId | null;
  parentUsername?: string | null;
  parentText?: string | null;
}

export default mongoose.model<IMessage>("Message", messageSchema);
