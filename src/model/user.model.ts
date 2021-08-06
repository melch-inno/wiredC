import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

/**
 * @interface UserDocument
 * @property {string} email - The user's email address
 * @property {string} password - The user's password
 * @property {string} name - The user's name
 * @property {string} comparePassword - The user's password to compare
 * @property {boolean} activation status
 * @property {dob} date of birth
 * @property {Object} address - The user's address
 * @property {string} address.street - The user's street
 * @property {string} address.city - The user's city
 * @property {string} address.zip - The user's zip
 * @property {string} description - The user's description
 * @property {boolean} isAdmin - The user's admin status
 * @property {boolean} isDeleted - The user's deleted status
 * @property {Date} createdAt - The date the user was created
 * @property {Date} updatedAt - The date the user was last updated
 */
export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  activationStatus: {
    type: Boolean;
    default: false;
  };

  dob: Date;
  address: {
    type: { type: Object };
    street: string;
    city: string;
    zip: string;
    location: {
      type: { type: String };
      coordinates: [];
    };
  };
  description: string;
  isAdmin: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @class UserSchema
 * @description The schema for the User model
 * @extends mongoose.Schema
 * @property {string} email - The user's email address
 * @property {string} password - The user's password
 * @property {string} name - The user's name
 * @property {string} comparePassword - The user's password to compare
 * @property {boolean} activation status
 * @property {dob} date of birth
 * @property {Object} address - The user's address
 * @property {string} address.street - The user's street
 * @property {string} address.city - The user's city
 * @property {string} address.zip - The user's zip
 * @property {string} description - The user's description
 * @property {boolean} isAdmin - The user's admin status
 * @property {boolean} isDeleted - The user's deleted status
 * @property {Date} createdAt - The date the user was created
 * @property {Date} updatedAt - The date the user was last updated
 */
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    activationStatus: { type: Boolean, default: false },
    dob: { type: Date, required: true },
    address: {
      type: { type: Object },
      city: { type: String, required: true },
      street: { type: String, required: true },
      zip: { type: String, required: true },
      location: {
        type: { type: String },
        coordinates: [],
      },
    },
    description: { type: String, required: false },
    isAdmin: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next: mongoose.HookNextFunction) {
  // eslint-disable-next-line no-invalid-this
  const user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

// Used for logging in
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  // eslint-disable-next-line github/no-then
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

UserSchema.index({ location: "2dsphere" });

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
