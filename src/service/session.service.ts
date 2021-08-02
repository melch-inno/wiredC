/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import { get } from "lodash";
import { Session, SessionDocument } from "../model";
import { sign, decode } from "../utils/jwt.utils";
import { findUser } from ".";

export async function createSession(
  userId: string,
  userAgent: string
): Promise<Object> {
  const session = await Session.create({ user: userId, userAgent });

  return session.toJSON();
}

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

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
): Promise<Object> {
  return (await Session.findOneAndUpdate(query, update)) as object;
}

export async function findSessions(
  query: FilterQuery<SessionDocument>
): Promise<SessionDocument[] | any> {
  return Session.find(query).lean();
}
