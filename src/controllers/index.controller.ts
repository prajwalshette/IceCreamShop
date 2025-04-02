import { NextFunction, Request, Response } from 'express';

export class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ _v: process.env.npm_package_version });
    } catch (error) {
      next(error);
    }
  };

  public healthCheck = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ status: 'SUCCESS' });
    } catch (error) {
      next(error);
    }
  };
}
