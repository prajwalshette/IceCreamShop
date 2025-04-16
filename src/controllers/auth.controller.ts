
// import { RequestWithUser } from '@/interfaces/auth.interface';
import { IUser, RequestWithUser, IAddress} from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { NextFunction, request, Request, Response } from 'express';
 

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

    public updateProfile = async (request: RequestWithUser, response: Response, next: NextFunction) => {
      try{
        const userData: IUser = request.body;
        const user = await this.authService.updateProfile(userData);
        response.status(200).json({ data: user, message: 'User Profile Update Sucessfully' });
      }catch(error){
        next(error);
      }
    }

    public createAdress = async (request: RequestWithUser, response: Response, next: NextFunction) => {
      try{
        const userId = request.user.userDocument.id;
        const addressData: IAddress = request.body;
        const address = await this.authService.createAdress({...addressData, userId});
        response.status(200).json({ data: address, message: 'User Addess create Sucessfully' });
      }catch(error){
        next(error);
      }
    }

    public getUserAdress = async (request: RequestWithUser, response: Response, next: NextFunction) => {
      try{
        const userId = request.user.userDocument.id;
        const address = await this.authService.getUserAdress(userId);
        response.status(200).json({ data: address, message: 'Sucessfully featch User Addess' });
      }catch(error){
        next(error);
      }
    }

}

