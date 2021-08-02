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

export async function createFollow(
  input: DocumentDefinition<FollowDocument>
): Promise<Object> {
  return await Follow.create(input);
}

export async function followUser(
  query: FilterQuery<FollowDocument>,
  update: UpdateQuery<FollowDocument>,
  options: QueryOptions
): Promise<FollowDocument | Object | null> {
  return await Follow.findOneAndUpdate(query, update, options);
}

export async function unfollowUser(
  query: FilterQuery<FollowDocument>,
  options: QueryOptions
): Promise<Object> {
  return Follow.findById(query, options).lean();
}
