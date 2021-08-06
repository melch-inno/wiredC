import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { Post, PostDocument } from "../model";

/**
 * @function createPost
 * @description Create a new post
 * @param {Object} input - The post to create
 * @returns {Promise<PostDocument | Object | null>} Promise<PostDocument | Object | null>
 * @memberof PostService
 */
export async function createPost(
  input: DocumentDefinition<PostDocument>
): Promise<PostDocument | Object | null> {
  return Post.create(input);
}

/**
 * @function findPost
 * @description Find a post by id
 * @param {ObjectId} id - The id of the post to find
 * @returns {Promise<PostDocument | Object | null>} Promise<PostDocument | Object | null>
 * @memberof PostService
 */
export async function findPost(
  query: FilterQuery<PostDocument>
): Promise<PostDocument> {
  return await Post.findOne(query).lean();
}

/**
 * @function findAllPosts
 * @description Find all posts
 * @param {Object} query - The query to find
 * @param {Object} options - The query options
 * @returns {Promise<PostDocument[] | Object | null>} Promise<PostDocument[] | Object | null>
 * @memberof PostService
 */
export async function findAllPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
): Promise<PostDocument | Object | null> {
  return await Post.find(query, {}, options);
}

/**
 * @function updatePost
 * @description Update a post
 * @param {ObjectId} id - The id of the post to update
 * @param {Object} update - The update to perform
 * @returns {Promise<PostDocument | undefined>} Promise<PostDocument | Object | null>
 * @memberof PostService
 */
export async function findAndUpdate(
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>,
  options: QueryOptions
): Promise<PostDocument | Object | null> {
  return await Post.findOneAndUpdate(query, update, options);
}

/**
 * @function deletePost
 * @description Delete a post
 * @param {ObjectId} id - The id of the post to delete
 * @returns {Promise<PostDocument | Object | null>} Promise<PostDocument | Object | null>
 * @memberof PostService
 */
export function deletePost(
  query: FilterQuery<PostDocument>
): PostDocument | Object | null {
  return Post.findOneAndRemove(query);
}
