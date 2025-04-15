export type Role = "ADMIN" | "STAFF" | "CUSTOMER"
import { Request } from 'express';
export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface IUserLogin {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    isDeleted: boolean;
    isBlocked: boolean;
  }

export interface DataStoredInToken {
	userId: string;
}

export interface TokenData {
	token: string;
	expiresIn: number;
}

export interface RequestWithUser extends Request {
	user: {
		userDocument: IUserDocument;
	};
}

export interface IUserDocument {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    isDeleted: boolean;
    isBlocked: boolean;
    // role: Role;
}

export interface IAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  isDeleted: boolean;
  userId: string;
}