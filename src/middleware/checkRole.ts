import { get } from "lodash";
import { Request, Response, NextFunction } from "express";

const checkRole = async (req: Request, res: Response, next: NextFunction) => {
  const user = get(req, "user");

  if (!user) {
    return res.sendStatus(403);
  }

  if (!user.isAdmin && user._id !== req.params.userId) {
    return res.status(403).json({
      message: `${req.params.userId}, "you are not authorized for this task"`,
    });
  }

  return next();
};

export default checkRole;
