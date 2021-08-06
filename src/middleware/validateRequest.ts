import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import log from "../logger";

/**
 * @function validate
 * @description validate request
 * @param {Request} req - express request
 * @param {Response} res - express response
 * @param {NextFunction} next - express next
 * @returns {void}
 */

const validate =
  (schema: AnySchema) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Object | void> => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (e) {
      log.error(e);
      return res.status(400).send(e.errors);
    }
  };

export default validate;
