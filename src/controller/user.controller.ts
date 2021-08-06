/* eslint-disable github/no-then */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { omit, get, isEmpty } from "lodash";
import {
  createUser,
  ConfirmationCode,
  findUser,
  followUser,
  unfollowUser,
  findUsersWithGeolocation,
  deleteAndReactivate,
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
        .status(404)
        .json({ message: `"User is deleted", "reactivate": "true/false"` });
    } else {
      const user = await createUser(req.body);
      await Follow.create({
        user: user._id,
        followers: [],
        following: [],
      });
      return res.send(omit(user, "password"));
    }
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
    if (isEmpty(user) || user.isDeleted === true) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.send(omit(user, "password"));
    }
  } catch (err) {
    log.error(err);
    return res.status(404).json({ message: err });
  }
}
/**
 * @function findUserWithGeolocation
 * @description get users by using geolocation search handler
 * @param {Request} req
 * @param {Response} res
 */
export async function getUsersByGeolocationHandler(
  req: Request,
  res: Response
): Promise<Object> {
  try {
    const { latt, long } = req.body;
    const user = await findUsersWithGeolocation({ latt, long });
    if (isEmpty(user)) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.send(omit(user, "password"));
    }
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
    return res.status(500).json({ message: err });
  }
}
/**
 * @function followUserHandler
 * @description follow user handler, follow and unfollow toggle function
 * @param {Request} req - Express request object {following: "userId"} the id of the user you want to follow
 * @param {Response} res - Express response object
 * @throws {Error
 */
export async function followAndUnfollowUserHandler(
  req: Request,
  res: Response
): Promise<Object | any> {
  const userId = await get(req, "user._id");
  const followThisId = req.body.following;

  try {
    if (userId === followThisId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    const CurrentUserFollow = await checkFollowing({ user: userId });

    if (!CurrentUserFollow.data[0].following.includes(followThisId)) {
      await followUser({ userId, followThisId });

      res.status(200).json({ message: "Followed successfully" });
    } else {
      await unfollowUser({ userId, followThisId });
      res.status(200).json({ message: "Unfollowed successfully" });
    }
  } catch (err: any) {
    log.error(err);
    return res.status(500).json({ message: err });
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
    const userId = req.params.userId;

    const user: any = await findUser({ _id: userId });
    log.info(user);

    if (!user || user?.isDeleted) {
      return res.status(404).send("User not found");
    }

    if (currentUser === userId) {
      await deleteAndReactivate(
        { _id: userId },
        { isDeleted: req.body.isDeleted },
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
