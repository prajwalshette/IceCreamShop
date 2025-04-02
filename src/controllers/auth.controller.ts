
// import { RequestWithUser } from '@/interfaces/auth.interface';
import { IUser } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { NextFunction, Request, Response } from 'express';
 

export class AuthController {
    private authService = new AuthService();
 
    public signup = async (request: Request, response: Response, next: NextFunction) => {
      try {
        const signUpData: IUser = request.body;
        const signUpUserData = await this.authService.signup(signUpData);
  
        response.status(201).json({ data: signUpUserData, message: 'User Register Sucessfully' });
      } catch (error) {
        next(error);
      }
    };

    public login = async (request: Request, response: Response, next: NextFunction) => {
        try {
          const loginData: IUser = request.body;
          const loginUserData = await this.authService.login(loginData);
    
          response.status(200).json({ data: loginUserData, message: 'login Sucessfully' });
        } catch (error) {
          next(error);
        }
      };

}

