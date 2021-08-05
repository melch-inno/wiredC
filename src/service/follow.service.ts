import { FilterQuery } from "mongoose";
import { Follow, FollowDocument } from "../model";

interface FollowRelations {
  userId: string;
  followThisId: string;
}

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
 * @function followUser
 * @description a function update a following relationship between two users
 * @param {string} (following: userId, follower: userId)
 * @return db.model<UserDocument>("Follow").create(id);
 * @throws {Error}
 */
export async function followUser({
  userId,
  followThisId,
}: FollowRelations): Promise<void> {
  await Follow.findOneAndUpdate(
    { user: userId },
    {
      $push: { following: followThisId },
    },
    { new: true }
  );
  await Follow.findOneAndUpdate(
    { user: followThisId },
    {
      $push: { followers: userId },
    },
    { new: true }
  );
}

/**
 * @function unfollowUser
 * @description a function update unfollowing relationship between two users
 * @param {string} (following: userId, follower: userId)
 * @return db.model<UserDocument>("Follow").create(id);
 * @throws {Error}
 */
export async function unfollowUser({
  userId,
  followThisId,
}: FollowRelations): Promise<void> {
  await Follow.findOneAndUpdate(
    { user: userId },
    {
      $pull: { following: followThisId },
    },
    { new: true }
  );
  await Follow.findOneAndUpdate(
    { user: followThisId },
    {
      $pull: { followers: userId },
    },
    { new: true }
  );
}
