import mongoose from "mongoose";
import { UserDocument } from ".";

export interface FollowDocument extends mongoose.Document {
  user: UserDocument["_id"];
  followers: String;
  following: String;
}

const FollowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    followers: [
      {
        type: String,
      },
    ],
    following: [
      {
        type: String,
      },
    ],
  },
  { toJSON: { virtuals: false } }
);

const Follow = mongoose.model<FollowDocument>("Follow", FollowSchema);
export default Follow;
