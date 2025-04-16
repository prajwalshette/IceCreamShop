import { DataStoredInToken, TokenData } from '..//interfaces/auth.interface';
import { IUser , IUserLogin, IAddress} from '../interfaces/auth.interface';
import { SECRET_KEY } from '../config';
import { HttpException } from '../exceptions/HttpException';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import prisma from '../database';

export const createToken = (userId: string): TokenData => {
  const dataStoredInToken: DataStoredInToken = { userId };
  const expiresIn: number = 60 * 60 * 24;

  if (!SECRET_KEY) throw new Error('SECRET_KEY is not defined');
  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};


@Service()
export class AuthService {
  private prisma = prisma;

  public async signup(signUpData: IUser): Promise<IUser> {
    const findUser = await this.prisma.user.findUnique({ where: { email: signUpData.email } });
    if (findUser) throw new HttpException(409, `Email (${signUpData.email}) already exists`);

    const createUserData: IUser = await this.prisma.user.create({ data: signUpData });
    return createUserData;
  }

  public async login(userData: IUser): Promise<{user: IUserLogin; tokenData: any }> {
  	const findUser = await this.prisma.user.findUnique({ where: { email: userData.email }});
  	if (!findUser) throw new HttpException(409, `User (${userData.email}) not found`);

    if (findUser.password !== userData.password) throw new HttpException(409, 'Password is not matching');

    const userWithoutPassword = { ...findUser };
    delete (userWithoutPassword as any).password;

    const tokenData = createToken(findUser.id);

  	return { user: findUser, tokenData };
  }

  public async updateProfile(userData: IUser): Promise<IUser> {
    const findUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(404, `Email (${userData.email}) not found`);

    const updateUserData: IUser = await this.prisma.user.update({
      where: { email: userData.email},
      data: {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
      }
     });
    return updateUserData;
  }

  public async createAdress(addressData: IAddress): Promise<IAddress> {
    const createAddressData: IAddress = await this.prisma.address.create({
      data: {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        userId: addressData.userId,
      },
      select: {
        id: true,
        street: true,
        city: true,
        state: true,
        zipCode: true,
        isDefault: true,
        isDeleted: true,
        userId: true,
      }
     });
    return createAddressData;
  }

  public async getUserAdress(userId : string): Promise<IAddress[]> {
    const addressData: IAddress[] = await this.prisma.address.findMany({
       where: { userId: userId },
       select: {
        id: true,
        street: true,
        city: true,
        state: true,
        zipCode: true,
        isDefault: true,
        isDeleted: true,
        userId: true,
      }
     });
    return addressData;
  }

}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          