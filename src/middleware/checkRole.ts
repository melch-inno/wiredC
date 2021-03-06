import { get } from "lodash";
import { Request, Response, NextFunction } from "express";

const checkRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Object | void> => {
  const user = get(req, "user");

  if (!user) {
    return res.sendStatus(403);
  }

  if (!user.isAdmin) {
    return res.status(403).json({
      message: "You are not authorized for this task",
    });
  }

  return next();
};

export default checkRole;
