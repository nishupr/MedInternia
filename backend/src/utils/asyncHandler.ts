import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = <Req extends Request = Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req, res, next) => {
    try {
      const result = fn(req as Req, res, next);
      Promise.resolve(result).catch(next);
    } catch (err) {
      next(err);
    }
  };
};
