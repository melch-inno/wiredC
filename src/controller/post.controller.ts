/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { get } from "lodash";
import {
  createPost,
  findPost,
  findAllPost,
  findAndUpdate,
  deletePost,
} from "../service";

/**
 * A function to create a new post handler
 * get the user id from the request,
 * get the body from the request,
 * call the  createPost service to create the post,
 * return the post
 */
export async function createPostHandler(
  req: Request,
  res: Response
): Promise<Object> {
  const userId = get(req, "user._id");
  const body = req.body;

  const post = await createPost({ ...body, user: userId }); // call the createPost service to create the post

  return res.send(post);
}

/**
 * A function to update a post handler,
 * get the post id from the request,
 * get the body from the request,
 * check if the user is the author of the post,
 * call the findAndUpdate service to update the post,
 * return the updated post
 */
export async function updatePostHandler(
  req: Request,
  res: Response
): Promise<Object> {
  const userId = get(req, "user._id");
  const postId = get(req, "params.postId");
  const update = req.body;

  const post: any = await findPost({ postId }); // get the post

  if (!post) {
    return res.sendStatus(404).json({ message: "Post not found" });
  }

  // check if the user is the author of the post
  if (String(post.user) !== userId) {
    return false;
  }

  // call the findAndUpdate service to update the post
  const updatedPost = await findAndUpdate({ postId }, update, { new: true });

  return res.send(updatedPost);
}

/**
 * A function to find a post handler
 * get the post id from the request,
 * call the findPost service to find the post,
 * return the post
 */
export async function getPostHandler(
  req: Request,
  res: Response
): Promise<Object> {
  const postId = get(req, "params.postId");
  const post = await findPost({ postId }); // get the post from the findPost service

  if (!post) {
    return res.sendStatus(404).json({ message: "Post not found" });
  }

  return res.send(post);
}

/**
 * A function to find All Post,
 * get the user id from the request,
 * call the findAllPost service to find all the posts,
 * return the posts
 */
export async function getAllPostsHandler(
  req: Request,
  res: Response
): Promise<Object> {
  const userId = get(req, "user._id");

  const posts = await findAllPost({ user: userId }); // get the posts from the findAllPost service
  return res.send(posts);
}

/**
 * A function to delete a post handler,
 * get the user id from the request,
 * get the post id from the request,
 * check if the user is the author of the post,
 * call the service to delete the post,
 * return
 */
export async function deletePostHandler(
  req: Request,
  res: Response
): Promise<Object> {
  const userId = get(req, "user._id");
  const postId = get(req, "params.postId");

  const post: any = await findPost({ postId });

  if (!post) {
    return res.send().json({ message: "Post not found" });
  }

  if (String(post.user) !== String(userId)) {
    return res
      .send(401)
      .json({ message: "You are not the author of this post" });
  } // check if the user is the author of the post

  await deletePost({ postId }); // delete the post

  return res.status(200).json({ message: "Post deleted" });
}
