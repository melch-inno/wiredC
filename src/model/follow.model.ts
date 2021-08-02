import mongoose from "mongoose";
// import { UserDocument } from ".";

export interface FollowDocument extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  followers: mongoose.Schema.Types.ObjectId;
  following: mongoose.Schema.Types.ObjectId;
}

const FollowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, required: false }],
  following: [{ type: mongoose.Schema.Types.ObjectId, required: false }],
});

const Follow = mongoose.model<FollowDocument>("Follow", FollowSchema);
export default Follow;
