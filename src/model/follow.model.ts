import mongoose from "mongoose";
import { UserDocument } from ".";

export interface FollowDocument extends mongoose.Document {
  readonly user: UserDocument["_id"];
  followers: mongoose.Schema.Types.ObjectId;
  following: mongoose.Schema.Types.ObjectId;
}

const FollowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
      },
    ],
  },
  { toJSON: { virtuals: false } }
);

const Follow = mongoose.model<FollowDocument>("Follow", FollowSchema);
export default Follow;
