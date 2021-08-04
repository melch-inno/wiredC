import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import log from "../logger";

const requiresUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Object> => {
  try {
    const user = get(req, "user");

    if (!user) {
      return res.sendStatus(403);
    }

    return next();
  } catch (error) {
    log.error(error);
    return res.sendStatus(500);
  }
};

export default requiresUser;
