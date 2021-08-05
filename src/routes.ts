import { Express, Request, Response } from "express";
import path from "path";
import {
  createUserHandler,
  confirmationCodeHandler,
  getUserHandler,
  getUsersByGeolocationHandler,
  updateUserHandler,
  followAndUnfollowUserHandler,
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
  // Static page to display the login page  with gihub auth
  app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "/static/index.html"));
  });

  // Static page to display the login page  with gihub auth
  app.get("/register/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "/static/index.html"));
  });

  // OAuthentication route
  app.get("/api/oauth", OAuthHandler);
  app.get("/api/oauth/callback", OAuthCallbackHandler);

  // Register user route
  app.post("/api/user", validateRequest(createUserSchema), createUserHandler);

  //confirm code route
  app.get("/api/auth/confirm/:confirmationCode", confirmationCodeHandler);

  // Login route
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // get user route
  app.get("/api/user/:userId", requiresUser, getUserHandler);

  // get users by geolocation route
  app.get("/api/geolocation/users", requiresUser, getUsersByGeolocationHandler);

  // follow And Unfollow User route
  app.put("/api/follow", requiresUser, followAndUnfollowUserHandler);

  // update user route
  app.put(
    "/api/user/:userId",
    [requiresUser, validateRequest(updateUserSchema)],
    updateUserHandler
  );

  // Get the user's sessions route
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Logout route
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  // delete and reactivate user route
  app.put(
    "/api/delete/user/:userId",
    requiresUser,
    deleteAndReactivateUserHandler
  );

  // Create a post route
  app.post(
    "/api/posts",
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  // Update a post route
  app.put(
    "/api/post/:postId",
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );

  // Get a post route
  app.get("/api/posts/:postId", getPostHandler);

  // Get all post route
  app.get("/api/posts/all/:userId", getAllPostsHandler);

  // Delete a post route
  app.delete(
    "/api/posts/:postId",
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}
