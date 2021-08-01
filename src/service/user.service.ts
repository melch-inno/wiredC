import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { omit } from "lodash";
import { User, UserDocument } from "../model";

/**
 * @function UserService
 * @description Service for create user CRUD operations
 * @return db.model<UserDocument>("User").find(filter);
 */
export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    return await User.create(input);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * @function verifyUser
 * @description Verify if user email
 * @param {string} confirmationCode
 * @return db.model<UserDocument>("User").findOne({ confirmationCode });
 * @throws {Error
 */
export async function ConfirmationCode(
  query: FilterQuery<UserDocument>,
  status: UpdateQuery<UserDocument>,
  options: QueryOptions) {
  return User.findByIdAndUpdate( query, status, options);
}

/**
 * @function findUser
 * @description Find user by id
 * @param {string} (_id: userId)
 * @return db.model<UserDocument>("User").findOne(id);
 * @throws {Error}
 */
export async function findUser(query: FilterQuery<UserDocument>) {
  return User.findOne(query).lean();
}

/**
 * @function updateUserHandler
 * @description Update user
 * @param {string} (_id: userId)
 * @param {DocumentDefinition<UserDocument>} input
 * @return db.model<UserDocument>("User").findOneAndUpdate(id, input);
 * @throws {Error
 */
export async function updateUser(
  query: FilterQuery<UserDocument>,
  updateItem: UpdateQuery<UserDocument>,
  options: QueryOptions
) {  
  return await User.findByIdAndUpdate(query, updateItem, options);  
}


/**
 * @function validatePassword
 * @description Validate user's password
 * @param {string} (email: User's email, password: User's password)
 * @return db.model<UserDocument>("User").findOne(query);
 * @throws {Error}
 * @compare {boolean}
 * @returns user if password is valid
 */
export async function validatePassword({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return false;
  }
  return omit(user.toJSON(), "password");
}


/**
 * @function deleteUser
 * @description Delete user
 * @param {string} (_id: userId)
 * @return db.model<UserDocument>("User").findOneAndRemove(id);
 * @throws {Error}
 */
export async function deleteAndReactivate(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions
) {
  return await User.findByIdAndUpdate(query, update, options).lean();
}
