/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import { get } from "lodash";
import { Session, SessionDocument } from "../model";
import { sign, decode } from "../utils/jwt.utils";
import { findUser } from ".";

/**
 * @function createSession
 * @description Create a session for a user
 * @param {string} userId - The user id
 * @param {string} userAgent - The user agent
 * @returns {Promise<Object>} The session object
 * @memberof Service
 */
export async function createSession(
  userId: string,
  userAgent: string
): Promise<Object> {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
}

/**
 * @function createAccessToken
 * @description Create an access token for a user
 * @param {string} user - The current user
 * @param {string} userAgent - The user session
 * @returns {Promise<Object>} The access token object
 * @memberof Service
 */
export function createAccessToken({
  user,
  session,
}: {
  user: any;
  session: any;
}): any {
  // Build and return the new access token
  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );
  return accessToken;
}

/**
 * @function reIssueAccessToken
 * @description Reissue an access token for a user
 * @param {string} refreshToken - The refresh token
 * @returns {Promise<string>} The access token
 * @memberof Service
 */
export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<string | boolean> {
  // Decode the refresh token
  const { decoded }: any = decode(refreshToken);

  if (!decoded || !get(decoded, "_id")) return false;

  // Get the session
  const session = await Session.findById(get(decoded, "_id"));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
}

/**
 * @function updateSession
 * @description Update user's session
 * @param {string} userId - The user id
 * @param {string} userAgent - The user agent
 * @returns {Promise<Object>} The session object
 * @memberof Service
 */
export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
): Promise<Object> {
  return (await Session.findOneAndUpdate(query, update)) as object;
}

/**
 * @function findSessions
 * @description Find user's sessions
 * @param {string} userId - The user id
 * @returns {Promise<Object>} The session object
 * @memberof Service
 */
export async function findSessions(
  query: FilterQuery<SessionDocument>
): Promise<SessionDocument[] | any> {
  return Session.find(query).lean();
}
