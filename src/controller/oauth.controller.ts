import { Request, Response } from "express";
import { get } from "lodash";
import axios from "axios";
import secrets from "../../config/secrets";



export async function OAuthController(req: Request, res: Response) {
  const client_id: any = get(req, "query.client_id");
  const client_secret = secrets.clientId as string;
  const redirectUri: string = get(req, "query.redirect_uri");
  const responseType: string = get(req, "query.response_type");
  
  const code = get(req, "query.code");

  const body = {
    client_id,
    client_secret,
    redirectUri,
    responseType,
    code,
  };

    const opts = { headers: { accept: 'application/json' } };
    axios
        .post('https://github.com/login/oauth/access_token', body, opts)
        .then((_res) => _res.data.access_token)
        .then((token) => {
        // eslint-disable-next-line no-console
        console.log('My token:', token);

        res.redirect(`/?token=${token}`);
        })
        .catch((err) => res.status(500).json({ err: err.message }));

  res.json(body);
}
