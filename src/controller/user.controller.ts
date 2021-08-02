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
    const user: any = await findUser({ confirmationCode: code });

    if (!user) {
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

    if (!user || user?.isDeleted) {
      return res.status(404).send("User not found");
    }

    return res.send(omit(user, "password"));
  } catch (e) {
    log.error(e);
    return res.status(404).send(e.message);
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
      return res.status(404).send("User not found");
    }

    // update the user
    const updatedUser = await updateUser({ _id: userId }, update, {
      new: true,
    });
    return res.send(omit(updatedUser, "password"));
  } catch (e) {
    log.error(e);
    return res.status(404).send(e.message);
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
): Promise<Object | void> {
  const user = get(req, "user")._id;
  const followThisId = get(req, "body.following");

  if (user === followThisId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const CurrentUserFollow = await checkFollowing({ user: followThisId });

  if (isEmpty(CurrentUserFollow.data)) {
    await Follow.create({
      user,
      followers: [],
      following: followThisId,
    })
      .then(
        () => {
          Follow.create({
            user: followThisId,
            followers: user,
            following: [],
          });
          res.sendStatus(200);
        },
        (err) => {
          log.error(err);
          return res.status(500).send(err);
        }
      )
      .catch((e) => {
        log.error(e);
      });
  } else {
    let checkFollow = "false";
    // eslint-disable-next-line github/array-foreach
    CurrentUserFollow.data[0].followers.forEach((item: any) => {
      if (String(item) === String(user)) {
        checkFollow = "true";
        return true;
      }
    });

    if (checkFollow === "false") {
      await Follow.findByIdAndUpdate(
        { user },
        {
          $push: { following: followThisId },
        },
        { new: true }
      )
        .then(
          () => {
            Follow.findByIdAndUpdate(
              { user: followThisId },
              {
                $push: { followers: user },
              },
              { new: true }
            );
            res.sendStatus(200);
          },
          (err) => {
            log.error(err);
            return res.status(500).send(err);
          }
        )
        .catch((e) => {
          log.error(e);
        });
      return res.sendStatus(200);
    } else {
      await Follow.findByIdAndUpdate(
        { user },
        {
          $pull: { following: followThisId },
        },
        { new: true }
      )
        .then(
          () => {
            Follow.findByIdAndUpdate(
              { user: followThisId },
              {
                $pull: { followers: user },
              },
              { new: true }
            );
            res.sendStatus(200);
          },
          (err) => {
            log.error(err);
            return res.status(500).send(err);
          }
        )
        .catch((e) => {
          log.error(e);
        });
    }
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
    const reqObject = req.body;

    const user: any = await findUser({ _id: reqObject.userId });

    if (!user || user?.isDeleted) {
      return res.status(404).send("User not found");
    }

    await deleteAndReactivate({ _id: reqObject.userId }, reqObject, {
      new: true,
    });
    return res.sendStatus(200);
  } catch (e) {
    log.error(e);
    return res.status(404).send(e.message);
  }
}
