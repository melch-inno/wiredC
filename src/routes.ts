import { Express, Request, Response } from "express";
import path from "path";
import {
  createUserHandler,
  confirmationCodeHandler,
  getUserHandler,
  updateUserHandler,
  followUserHandler,
  deleteAndReactivateUserHandler,
  createPostHandler,
  updatePostHandler,
  getPostHandler,
  getAllPostsHandler,
  deletePostHandler,
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionsHandler,
} from "./controller";

import {
  validateRequest,
  requiresUser,
  checkRole,
  OAuthHandler,
  OAuthCallbackHandler,
} from "./middleware";
import {
  createUserSchema,
  updateUserSchema,
  createUserSessionSchema,
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} from "./schema";

export default function Route(app: Express): void {
  app.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(200).json({ message: "OK" })
  );

  app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "/static/index.html"));
  });

  app.get("/api/oauth", OAuthHandler);
  app.get("/api/oauth/callback", OAuthCallbackHandler);

  // Register user
  app.post("/api/user", validateRequest(createUserSchema), createUserHandler);

  //confirm code
  app.get("/api/auth/confirm/:confirmationCode", confirmationCodeHandler);

  // Login
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // get user
  app.get("/api/user/:userId", checkRole, getUserHandler);

  // followUserHandler
  app.put("/api/follow", requiresUser, followUserHandler);

  // update user
  app.put(
    "/api/user/:userId",
    [checkRole, validateRequest(updateUserSchema)],
    updateUserHandler
  );

  // Get the user's sessions
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Logout
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  // delete and reactivate user
  app.put(
    "/api/user/delete/:userId",
    checkRole,
    deleteAndReactivateUserHandler
  );

  // Create a post
  app.post(
    "/api/posts",
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  // Update a post
  app.put(
    "/api/posts/:postId",
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );

  // Get a post
  app.get("/api/posts/:postId", getPostHandler);

  // Get all post
  app.get("/api/posts/all/:userId", getAllPostsHandler);

  // Delete a post
  app.delete(
    "/api/posts/:postId",
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}
