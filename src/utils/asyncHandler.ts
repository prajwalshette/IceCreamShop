import { Request, Response, NextFunction, RequestHandler } from 'express';
import { RequestWithUser } from '../interfaces/auth.interface';

const asyncHandler = (
    fn: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>
  ): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
      return Promise.resolve(fn(req as RequestWithUser, res, next)).catch(next);
    };
  };

export default asyncHandler;