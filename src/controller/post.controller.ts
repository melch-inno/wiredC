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
 * @function createPostHandler
 * @description A function to create a new post handler
 * @param  {Request} req get the user id from the request,
 * @param  {Response} res json object of the post request,
 * @return {Response} json object of the post request
 * @throws {Error} An error if the post id is not provided
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
 * @function updatePostHandler
 * @description A function to update a post handler,
 * @param  {Request} req get the user id from the get() function request,
 * @param  {Response} res json object of the post request,
 * @check check if the user is the author of the post,
 * @func  call the findAndUpdate service to update the post,
 * @return {Response} json object of the post request
 * @throws {Error} An error if the post id is not provided
 */
export async function updatePostHandler(
  req: Request,
  res: Response
): Promise<Object> {
  try {
    const postId = get(req, "params.postId");
    const userId = get(req, "user._id");
    const update = req.body;

    const post = await findPost({ postId }); // get the post

    //check if the user is the author of the post,
    if (!post) {
      return res.sendStatus(404);
    } else if (post.user !== userId) {
      return res.sendStatus(401);
    } else {
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
 * @function getPostHandler
 * @description A function to find a post handler,
 * @param {Request} req - {title, body}
 * @param {Response} res - json object of the post request
 * @returns {Promise<Object>} - return the post ,
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
 * @function getAllPostHandler
 * @description A function to find All Post,
 * @param {Request} req the user id from the request,
 * @param {Response} res json object of the post request,
 * @call the findAllPost service to find all the posts,
 * @return the posts
 * @throws {Error} An error if the post id is not provided
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
 * @function deletePostHandler
 * @description A function to delete a post handler,
 * @param {Request} req the user id from the request,
 * @param {Response} res  get the post id from the request,
 * @func check if the user is the author of the post,
 * @func call the service to delete the post,
 * @return json object of the post request
 * @throws {Error} An error if the post id is not provided
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
