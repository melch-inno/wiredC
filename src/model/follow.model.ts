import mongoose from "mongoose";
import { UserDocument } from ".";

/**
 * @function FollowDocument
 * @type {Model<FollowDocument>}
 * @property {string} user - The user id
 * @property {string} FollowThisId - The follow id
 */
export interface FollowDocument extends mongoose.Document {
  user: UserDocument["_id"];
  followers: String;
  following: String;
}

/**
 * @function FollowSchema
 * @type {Schema<FollowDocument>}
 * @property {string} user - The user id
 * @property {string} FollowThisId - The follow id
 * @property {string} followers - The followers
 * @property {string} following - The following
 * @property {Timestamp} createdAt - The created at
 * @property {Timestamp} updatedAt - The updated at
 */
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
