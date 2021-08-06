import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { UserDocument } from ".";

/**
 * @Interface PostDocument
 * @type {IUserDocument}
 * @property {string} title - The title of the post
 * @property {string} body - The content of the post
 * @property {Date} createdAt - The first time the post was created
 * @property {Date} updatedAt - The last time the post was updated
 */
export interface PostDocument extends mongoose.Document {
  readonly user: UserDocument["_id"];
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @function PostSchema
 * @return {mongoose.Schema}
 * @description The schema for the Post model
 * @property {string} title - The title of the post
 * @property {string} body - The content of the post
 * @property {Date} createdAt - The first time the post was created
 * @property {Date} updatedAt - The last time the post was updated
 * @property {UserDocument} user - The user that created the post
 * @property {string} postId - The secondary id of the post
 */
const PostSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, default: true },
    body: { type: String, default: true },
  },
  { timestamps: true }
);

const Post = mongoose.model<PostDocument>("Post", PostSchema);

export default Post;
