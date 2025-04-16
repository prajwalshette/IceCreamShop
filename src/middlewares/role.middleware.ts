// import { NextFunction, Response } from 'express';
// import { RequestWithUser } from '../interfaces/auth.interface';
// import { HttpException } from '../exceptions/HttpException';
// import { Role } from '@prisma/client';

// export class RoleMiddleware {
//   public verifyRoles = (roles: Role[]) => {
//     return async (req: RequestWithUser, res: Response, next: NextFunction) => {
//       try {
//         const userRole = req.user.userDocument.role;
        
//         if (!roles.includes(userRole)) {
//           throw new HttpException(403, 'You do not have permission to access this resource');
//         }
        
//         next();
//       } catch (error) {
//         next(error);
//       }
//     };
//   };
// }