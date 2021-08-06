/* eslint-disable github/no-then */
import { Request, Response } from "express";
import { get } from "lodash";
import axios from "axios";
import secrets from "../../config/secrets";
import log from "../logger";

export async function OAuthHandler(req: Request, res: Response): Promise<void> {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${secrets.clientId}`
  );
}

/**
 * @function OAuthCallbackHandler
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 * @description Handles the callback from GitHub.
 * @example
 * OAuthCallbackHandler(req, res);
 * // => Redirects to the user's profile page.
 */
export async function OAuthCallbackHandler(
  req: Request,
  res: Response
): Promise<Object | void> {
  const client_secret = secrets.clientSecrets;
  const email = get(req, "query.email");
  const client_id = secrets.clientId;
  const code = get(req, "query.code");

  const body = {
    client_id,
    client_secret,
    email,
    code,
  };

  const opts = { headers: { accept: "application/json" } };
  axios
    .post("https://github.com/login/oauth/access_token", body, opts)
    .then((_res) => {
      log.info("Github OAuth callback", _res);
    })
    .catch((err) => res.status(500).json({ err: err.message }));

  res.json(body);
}
