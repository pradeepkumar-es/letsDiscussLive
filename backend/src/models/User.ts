import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 24 },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export interface IUser extends mongoose.Document {
  username: string; email: string; password: string;
  comparePassword(candidate: string): Promise<boolean>;
}

export default mongoose.model<IUser>("User", userSchema);
