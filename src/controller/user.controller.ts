/* eslint-disable github/no-then */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { omit, get, isEmpty } from "lodash";
import {
  createUser,
  ConfirmationCode,
  findUser,
  deleteAndReactivate,
  // createFollow,
  // followUser,
  // unfollowUser,
  checkFollowing,
  updateUser,
} from "../service";
import { Follow } from "../model";
import log from "../logger";

/**
 * @function createUserHandler
 * @description create user handler
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise} Express response object
 */

export async function createUserHandler(
  req: Request,
  res: Response
): Promise<any | Object> {
  try {
    const checkUser: any = await findUser({ email: req.body.email });

    log.info(req.body);

    if (checkUser && !checkUser?.isDeleted) {
      return res.status(409).send("User already exist");
    } else if (checkUser?.isDeleted) {
      return res
        .status(409)
        .json({ message: "User is deleted", reactivate: "true/false" });
    }

    const user = await createUser(req.body);
    return res.send(omit(user, "password"));
  } catch (e) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

/**
 * @function ConfirmationCode
 * @description Confirmation code handler
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise} Express response object
 */
export async function confirmationCodeHandler(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const code = get(req, "params.code");
    const user: any = await findUser({ _id: code });

    if (!user.code === code) {
      return res.status(404).send("User not found");
    } else if (user?.activationStatus) {
      return res.status(409).send("User already activated");
    }

    await ConfirmationCode({ _id: user?._id }, { status: true }, { new: true });
    return res.sendStatus(200);
  } catch (e) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

/**
 * @function getUserHandler
 * @description get user handler
 * @param {Request} req
 * @param {Response} res
 */
export async function getUserHandler(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const user: any = await findUser({ _id: req.params.userId });
    if (!user || user.isDeleted === true) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.send(omit(user, "password"));
  } catch (err) {
    log.error(err);
    return res.status(404).json({ message: err });
  }
}

/**
 * @function updateUserHandler
 * @description update user handler
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @throws {Error}
 */
export async function updateUserHandler(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const userId = req.params.userId;
    const update = req.body;

    // check if the user to be updated exist
    const user: any = await findUser({ _id: userId });
    if (!user || user?.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    // update the user
    const updatedUser = await updateUser({ _id: userId }, update, {
      new: true,
    });
    return res.send(omit(updatedUser, "password"));
  } catch (err) {
    log.error(err);
    return res.status(404).json({ message: err });
  }
}
/**
 * @function followUserHandler
 * @description follow user handler
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @throws {Error
 */
export async function followUserHandler(
  req: Request,
  res: Response
): Promise<Object | any> {
  const userId: String = await get(req, "user._id");
  const followThisId = get(req, "body.following");

  try {
    if (userId === followThisId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    const CurrentUserFollow = await checkFollowing({ user: followThisId });
    const otherUserFollowObj = await checkFollowing({ user: userId });
    log.info(CurrentUserFollow.data[0].followers);

    if (isEmpty(CurrentUserFollow)) {
      await Follow.create({
        user: userId,
        followers: [],
        following: followThisId,
      })
        .then(
          () => {
            if (isEmpty(otherUserFollowObj)) {
              Follow.create({
                user: followThisId,
                followers: userId,
                following: [],
              });
            } else {
              Follow.findOneAndUpdate(
                { user: followThisId },
                {
                  $push: { following: userId },
                },
                { multi: true }
              );
            }
            res.status(200).json({ message: "Followed successfully" });
          },
          (err) => {
            log.error(err);
            return res.status(500).json({ message: err });
          }
        )
        .catch((e) => {
          log.error(e);
        });
    } else {
      if (!CurrentUserFollow.data[0].followers.includes(userId)) {
        Follow.findOneAndUpdate(
          { user: userId },
          {
            $push: { following: followThisId },
          },
          { multi: true }
        )
          .then(
            () => {
              if (isEmpty(otherUserFollowObj)) {
                Follow.create({
                  user: followThisId,
                  followers: userId,
                  following: [],
                });
              } else {
                Follow.findOneAndUpdate(
                  { user: followThisId },
                  {
                    $push: { followers: userId },
                  },
                  { multi: true }
                );
              }
              res.sendStatus(200).json({ message: "Followed successfully" });
            },
            (err) => {
              log.error(err);
              return res.status(500).json({ message: err });
            }
          )
          .catch((err) => {
            log.error(err);
            return res.status(500).json({ message: err });
          });
      } else {
        Follow.findOneAndUpdate(
          { userId },
          {
            $pull: { following: followThisId },
          },
          { multi: true }
        )
          .then(
            () => {
              Follow.findOneAndUpdate(
                { user: followThisId },
                {
                  $pull: { followers: userId },
                },
                { multi: true }
              );
              res.sendStatus(200);
            },
            (err) => {
              log.error(err);
              return res.status(500).json({ message: err });
            }
          )
          .catch((err) => {
            log.error(err);
            return res.status(500).json({ message: err });
          });
      }
    }
  } catch (error) {
    log.error(error);
    return res.status(400).json({ message: error });
  }
}

/**
 * @function deleteAndReactivate
 * @description delete user handler
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @throws {Error}
 * @returns status
 */
export async function deleteAndReactivateUserHandler(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const currentUser = get(req, "user._id");
    const reqObject = req.body;

    log.info(currentUser);

    const user: any = await findUser({ _id: req.body.userId });

    if (!user || user?.isDeleted) {
      return res.status(404).send("User not found");
    }

    if (currentUser === req.body.userId) {
      await deleteAndReactivate(
        { _id: reqObject.userId },
        { isDeleted: reqObject.isDeleted },
        {
          new: true,
        }
      );
      return res.sendStatus(200);
    } else {
      return res.status(400).send("You are not authorized to delete this user");
    }
  } catch (e) {
    log.error(e);
    return res.status(404).send(e.message);
  }
}
