import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { Post, PostDocument } from "../model";

export function createPost(
  input: DocumentDefinition<PostDocument>
): Promise<Object> {
  return Post.create(input);
}

export function findPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
): Promise<any> {
  return Post.findOne(query, {}, options) as any;
}

//find All Post
export function findAllPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
): Promise<any> {
  return Post.find(query, {}, options) as any;
}

// update posts
export function findAndUpdate(
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>,
  options: QueryOptions
): Promise<any> {
  return Post.findOneAndUpdate(query, update, options) as any;
}

export function deletePost(query: FilterQuery<PostDocument>): Promise<any> {
  return Post.findOneAndRemove(query) as any;
}
