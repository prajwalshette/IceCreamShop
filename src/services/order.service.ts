import { HttpException } from '../exceptions/HttpException';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import prisma from '../database';


@Service()
export class AuthService {
  private prisma = prisma;

}