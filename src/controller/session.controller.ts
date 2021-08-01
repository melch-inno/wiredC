import config from "config";
import secrets from "../../config/secrets";
import { get } from "lodash";
import { Request, Response } from "express";
import { sign } from "../utils/jwt.utils";

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
export async function oauthHandler(req: Request, res: Response) {
  const clientId = secrets.clientId as string;
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}`
  );
}

/**
 * @function createUserSessionHandler
 * @description Create a user session
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @private
 */
export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the email and password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create access token
  //@ts-ignore
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
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
