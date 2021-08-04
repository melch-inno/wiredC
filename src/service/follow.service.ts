import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { Follow, FollowDocument } from "../model";

/**
 * @function findUser
 * @description Find user by id
 * @param {string} (_id: userId)
 * @return db.model<UserDocument>("User").findOne(id);
 * @throws {Error}
 */
export async function checkFollowing(
  query: FilterQuery<FollowDocument>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Object | any> {
  const checkFollow = await Follow.find(query);
  return { data: checkFollow };
}
/**
 * @function createFollow
 * @description a function to create a follow object the first time a user follows another user
 * @param {string} (following: userId, follower: userId)
 * @return db.model<UserDocument>("Follow").create(id);
 * @throws {Error}
 */
export async function createFollow(
  input: DocumentDefinition<FollowDocument>
): Promise<Object> {
  return await Follow.create(input);
}
/**
 * @function followUser
 * @description a function update a following relationship between two users
 * @param {string} (following: userId, follower: userId)
 * @return db.model<UserDocument>("Follow").create(id);
 * @throws {Error}
 */
export async function followUser(
  query: FilterQuery<FollowDocument>,
  update: UpdateQuery<FollowDocument>,
  options: QueryOptions
): Promise<FollowDocument | Object | null> {
  return await Follow.findOneAndUpdate(query, update, options);
}

/**
 * @function unfollowUser
 * @description a function update unfollowing relationship between two users
 * @param {string} (following: userId, follower: userId)
 * @return db.model<UserDocument>("Follow").create(id);
 * @throws {Error}
 */
export async function unfollowUser(
  query: FilterQuery<FollowDocument>,
  options: QueryOptions
): Promise<Object> {
  return Follow.findById(query, options).lean();
}
