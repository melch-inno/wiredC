/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "config";
import secrets from "../../config/secrets";
import { get } from "lodash";
import { Request, Response } from "express";
import { sign } from "../utils/jwt.utils";
import log from "../logger";

import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
  validatePassword,
} from "../service";

/**
 * @function oauthHandler
 * @description OAuth2 handler for login and signup
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export async function oauthHandler(req: Request, res: Response): Promise<void> {
  try {
    const clientId = secrets.clientId;
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${clientId}`
    );
  } catch (error) {
    log.info(error);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * @function createUserSessionHandler
 * @description Create a user session
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @private
 */
export async function createUserSessionHandler(
  req: Request,
  res: Response
): Promise<Object | any> {
  try {
    // validate the email and password
    const user = await validatePassword(req.body);

    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    // Create a session
    const session = await createSession(user._id, req.get("user-agent") || "");

    // create access token
    const accessToken = createAccessToken({
      user,
      session,
    });

    // create refresh token
    const refreshToken = sign(session, {
      expiresIn: config.get("refreshTokenTtl"), // 1 year
    });

    // send refresh & access token back
    return res.send({ accessToken, refreshToken });
  } catch (error) {
    log.error(error);
    return res.status(500).send(error);
  }
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
): Promise<Object> {
  try {
    const sessionId = get(req, "user.session");

    await updateSession({ _id: sessionId }, { valid: false });

    return res.sendStatus(200);
  } catch (error) {
    log.info(error);
    return res.status(500).send(error);
  }
}

export async function getUserSessionsHandler(
  req: Request,
  res: Response
): Promise<Object> {
  try {
    const userId = get(req, "user._id");

    const sessions = await findSessions({ user: userId, valid: true });

    return res.send(sessions);
  } catch (error) {
    log.info(error);
    return res.sendStatus(500);
  }
}
