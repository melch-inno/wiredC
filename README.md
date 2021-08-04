<p align="center">
  <a href="https://github.com/melch-inno/wiredC/actions"><img alt="typescript-action status" src="https://github.com/melch-inno/wiredC/actions/workflows/test.yml/badge.svg"></a>
</p>

# Node Api using TypeScript || WiredCraft test assignment

- This demonstrate a simple crud operation

- I used sessions and refresh tokens authentication
-

dependencies

yarn add express yup config cors express mongoose pino pino-pretty dayjs bcrypt jsonwebtoken lodash nanoid

dev-dependencies

yarn add @types/body-parser @types/config @types/cors @types/express @types/node @types/yup @types/pino @types/mongoose @types/bcrypt @types/jsonwebtoken @types/lodash @types/nanoid ts-node typescript -D

Install the dependencies

```bash
$ yarn

  or

$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

How to run App:
✓ After install the dependencis,
✓ run yarn dev
✓ Use postman to test the api
✓ The project has "WiredCraft.postman_collection.json" file in the root folder
✓ It can be imported into postman for quick setting
✓ In brief:

1. signup using the signup paramenters
2. create a session / signin 3. update user
3. delete user [ user isDeleted is set to true]
4. create/update/delete posts
5. follow and unfollow users
6. delete session [signout/logout]
7. Oauth signup with github account
8. Short video demo

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

## Testing lint: use "yarn all" to run below test in the app

"npm run build && npm run format && npm run lint && npm run package && npm test"

## Testing lint:

to reference the stable and latest V1 action

npm run lint

![3-load-test](screenshots/Screen Shot 2021-08-03 at 6.42.29 PM.png)

![3-load-test](screenshots/Screen Shot 2021-08-03 at 6.42.29 PM.png)
![3-load-test](screenshots/Screen Shot 2021-08-03 at 6.42.29 PM.png)
![3-load-test](screenshots/Screen Shot 2021-08-03 at 6.42.29 PM.png)
![3-load-test](screenshots/Screen Shot 2021-08-03 at 6.42.29 PM.png)
