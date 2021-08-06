import mongoose from "mongoose";
import { UserDocument } from ".";

/**
 * @interface SessionDocument
 * @property {string} user
 * @property {boolean} valid
 * @property {string} agent
 * @property {Date}  created
 * @property {Date}  lastAccess
 */
export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @Schema SessionSchema
 * @type {Schema}
 * @property {string} user
 * @property {boolean} valid
 * @property {string} agent
 * @property {Date}  created
 * @property {Date}  lastAccess
 */
const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const Session = mongoose.model<SessionDocument>("Session", SessionSchema);

export default Session;
