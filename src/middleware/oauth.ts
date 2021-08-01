import {Request, Response} from 'express'
import {get} from 'lodash'
import axios from 'axios'
import secrets from '../../config/secrets'

export async function OAuthHandler(req: Request, res: Response) {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${secrets.clientId}`
  )
}

export async function OAuthCallbackHandler(req: Request, res: Response) {
  // const client_id: any = get(req, 'query.client_id')
  const client_secret = secrets.clientSecrets as string
  const email = get(req, 'query.email')
  const client_id = secrets.clientId as string
  const code = get(req, 'query.code')

  const body = {
    client_id,
    client_secret,
    email,
    code
  }

  const opts = {headers: {accept: 'application/json'}}
  axios
    .post('https://github.com/login/oauth/access_token', body, opts)
    .then(_res => {
      console.log(_res)
    })
    .catch(err => res.status(500).json({err: err.message}))

  res.json(body)
}
