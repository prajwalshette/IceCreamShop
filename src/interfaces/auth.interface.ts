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