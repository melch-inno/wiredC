import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { Post, PostDocument } from "../model";

interface PostItem {
  _id: string;
  title: string;
  body: string;
  user: string;
}

export async function createPost(
  input: DocumentDefinition<PostDocument>
): Promise<PostDocument | Object | null> {
  return Post.create(input);
}

export async function findPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
): Promise<PostDocument | Object | null> {
  return await Post.findOne(query, {}, options);
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
): any {
  return Post.findOneAndUpdate(query, update, options);
}

export function deletePost(
  query: FilterQuery<PostDocument>
): PostDocument | Object | null {
  return Post.findOneAndRemove(query);
}
