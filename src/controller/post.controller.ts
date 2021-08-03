import { Request, Response } from "express";
import { get } from "lodash";
import {
  createPost,
  findPost,
  findAllPost,
  findAndUpdate,
  deletePost,
} from "../service";

import log from "../logger";

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
  try {
    const userId = get(req, "user._id");
    const body = req.body;

    const post = await createPost({ ...body, user: userId }); // call the createPost service to create the post
    return res.send(post);
  } catch (error) {
    log.info(error);
    return res.status(500).send(error);
  }
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
): Promise<Object | null> {
  try {
    const userId = get(req, "user._id");
    const postId = get(req, "params.postId");
    const update = req.body;

    const post: any = await findPost({ postId }); // get the post

    if (!post.user) {
      return res.sendStatus(404);
    }

    // check if the user is the author of the post
    if (String(post.user) !== userId) {
      return res.sendStatus(401);
    }

    // call the findAndUpdate service to update the post
    const updatedPost = await findAndUpdate({ postId }, update, { new: true });
    return res.status(200).json(updatedPost);
  } catch (error) {
    log.info(error);
    return res.status(500).send(error);
  }
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
  try {
    const postId = get(req, "params.postId");
    const post = await findPost({ postId }); // get the post from the findPost service

    if (!post) {
      return res.sendStatus(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    log.info(error);
    return res.status(500).send(error);
  }
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
): Promise<Object | null> {
  try {
    const userId = get(req, "user._id");

    const posts = await findAllPost({ user: userId }); // get the posts from the findAllPost service
    return res.send(posts);
  } catch (error) {
    log.info(error);
    return res.status(500).send(error);
  }
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
): Promise<Object | null> {
  try {
    const userId = get(req, "user._id");
    const postId = get(req, "params.postId");

    const post: any = await findPost({ postId });

    if (!post) {
      return res.sendStatus(404).json({ message: "Post not found" });
    }

    if (post.user !== userId) {
      return res
        .sendStatus(401)
        .json({ message: "You are not the author of this post" });
    } // check if the user is the author of the post
    else {
      deletePost({ postId }); // delete the post

      return res.sendStatus(200).json({ message: "Post deleted" });
    }
  } catch (error) {
    log.info(error);
    return res.status(500).send(error);
  }
}
