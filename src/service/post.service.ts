import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { Post, PostDocument } from "../model";

export function createPost(input: DocumentDefinition<PostDocument>): any {
  return Post.create(input);
}

export async function findPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
): Promise<any> {
  return await Post.findOne(query, {}, options);
}

//find All Post
export async function findAllPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
): Promise<any> {
  return await Post.find(query, {}, options);
}

// update posts
export function findAndUpdate(
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>,
  options: QueryOptions
): any {
  return Post.findOneAndUpdate(query, update, options);
}

export function deletePost(query: FilterQuery<PostDocument>): any {
  return Post.findOneAndRemove(query);
}
