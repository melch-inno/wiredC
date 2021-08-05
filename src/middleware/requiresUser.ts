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

    if (!user || user.isDeleted === true) {
      return res.status(401).json({ message: "Login Required" });
    }

    return next();
  } catch (error) {
    log.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default requiresUser;
