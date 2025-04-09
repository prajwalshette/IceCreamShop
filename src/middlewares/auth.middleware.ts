import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';
import { IUserDocument, IUser } from '../interfaces/auth.interface';
import { SECRET_KEY } from '../config';
import { HttpException } from '../exceptions/HttpException';
import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import prisma from '../database';

const getAuthorization = (req: any) => {
  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { userId } = (await verify(Authorization, SECRET_KEY as string )) as DataStoredInToken;
      const userDetails = await prisma.user.findUnique({ where: { id: userId } });
      
      if (userDetails) {
        const userDocument: IUserDocument = {
          id: userDetails.id,
          name: userDetails.name,
          email: userDetails.email,
          phoneNumber: userDetails.phoneNumber,
          isDeleted: userDetails.isDeleted,
          isBlocked: userDetails.isBlocked
        };
        
        req.user = { userDocument };
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
     next(error);
  }
};