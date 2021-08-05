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

    const post = findPost({ postId: "j652yDK0Gr" }); // get the post
    log.info("ggjhgjhgjhgh", post);
    if (!post) {
      return res.sendStatus(404);
    }

    // check if the user is the author of the post
    if (String(post) !== userId) {
      return res.sendStatus(401);
    } else {
      log.info("ggjhgjhgjhgh", post);

      // call the findAndUpdate service to update the post
      const updatedPost = await findAndUpdate({ postId }, update, {
        new: true,
      });
      return res.status(200).json(updatedPost);
    }
  } catch (error) {
    log.info(error);
    return res.status(500).send(error.message);
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
    } else {
      return res.status(200).json(post);
    }
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

    const post = await findPost({ postId });
    log.info(userId);
    log.info(post);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    } else if (post !== userId) {
      return res
        .status(401)
        .json({ message: "You are not the author of this post" });
    } else {
      deletePost({ postId }); // delete the post
      return res.status(200).json({ message: "Post deleted" });
    }
  } catch (error) {
    log.info(error);
    return res.status(500).send(error);
  }
}
