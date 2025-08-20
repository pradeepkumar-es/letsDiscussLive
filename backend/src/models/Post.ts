import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    content:   { type: String, required: true, trim: true, maxlength: 5000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);
export interface IPost extends mongoose.Document {
  content: string; createdBy: mongoose.Types.ObjectId;
}
export default mongoose.model<IPost>("Post", postSchema);
