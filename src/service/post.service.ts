import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { Post, PostDocument } from "../model";

export async function createPost(
  input: DocumentDefinition<PostDocument>
): Promise<Object | null> {
  return await Post.create(input);
}

export async function findPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
): Promise<Object | null> {
  return await Post.findOne(query, {}, options);
}

//find All Post
export async function findAllPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
): Promise<Object | null> {
  return await Post.find(query, {}, options);
}

// update posts
export async function findAndUpdate(
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>,
  options: QueryOptions
): Promise<Object | null> {
  return await Post.findOneAndUpdate(query, update, options);
}

export async function deletePost(
  query: FilterQuery<PostDocument>
): Promise<Object | null> {
  return await Post.findOneAndRemove(query);
}
