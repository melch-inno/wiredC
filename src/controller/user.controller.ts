import { Request, Response } from "express";
import { omit, get } from "lodash";
import { createUser, ConfirmationCode, findUser, deleteAndReactivate, updateUser } from "../service";
import log from "../logger";

/**
 * @function createUserHandler
 * @description create user handler
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise} Express response object
 */

export async function createUserHandler(req: Request, res: Response) {
  try {
    const checkUser = await findUser({ email: req.body.email });

    if (checkUser && !checkUser.isDeleted) {
      return res.status(409).send("User already exist");
    } else if (checkUser?.isDeleted) {
      return res.status(409).json({ message: "User is deleted", reactivate: "true/false" },);
    }

    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
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
export async function confirmationCodeHandler(req: Request, res: Response) {
  try {
    const code = get(req, "params.code");
    const user = await findUser({ confirmationCode: code });

    if (!user) {
      return res.status(404).send("User not found");
    }else if (user?.activationStatus) {
      return res.status(409).send("User already activated");
    }
    
    const confirm = await ConfirmationCode({ _id: user?._id }, { status: true }, { new: true });
    return res.sendStatus(200);
  }
  catch (e) {
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
export async function getUserHandler(req: Request, res: Response) {
  try {
    const user = await findUser({ _id: req.params.userId });

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
export async function updateUserHandler(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const update = req.body;

    // check if the user to be updated exist
    const user = await findUser({ _id: userId });
    if (!user || user?.isDeleted) {
      return res.status(404).send("User not found");
    }

    // update the user
    const updatedUser = await updateUser( {_id: userId}, update, { new: true });
    return res.send(omit(updatedUser, "password"));
  } catch (e) {
    log.error(e);
    return res.status(404).send(e.message);
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
export async function deleteAndReactivateUserHandler(req: Request, res: Response) {
  try {
    const reqObject = req.body

    const user = await findUser({ _id: reqObject.userId });

    if (!user || user?.isDeleted) {
      return res.status(404).send("User not found");
    }
   
    await deleteAndReactivate({ _id: reqObject.userId }, reqObject, { new: true });
    return res.sendStatus(200);
  } catch (e) {
    log.error(e);
    return res.status(404).send(e.message);
  }
}

