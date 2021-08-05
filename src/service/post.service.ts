import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { Post, PostDocument } from "../model";

export async function createPost(
  input: DocumentDefinition<PostDocument>
): Promise<PostDocument | Object | null> {
  return Post.create(input);
}

export async function findPost(
  query: FilterQuery<PostDocument>
): Promise<PostDocument> {
  return await Post.findOne(query).lean();
}

//find All Post
export async function findAllPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
): Promise<PostDocument | Object | null> {
  return await Post.find(query, {}, options);
}

// update posts
export function findAndUpdate(
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>,
  options: QueryOptions
): PostDocument | unknown {
  return Post.findOneAndUpdate(query, update, options);
}

export function deletePost(
  query: FilterQuery<PostDocument>
): PostDocument | Object | null {
  return Post.findOneAndRemove(query);
}
