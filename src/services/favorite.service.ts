import { HttpException } from '../exceptions/HttpException';
import { Service } from 'typedi';
import prisma from '../database';
import { IFavorite } from '../interfaces/favorite.interface';


@Service()
export class FavoriteService {
  private prisma = prisma;

  public async addAndRemoveFavorite(favoriteData: IFavorite): Promise<{data: IFavorite, message: string}> {
    const findFavorite = await this.prisma.favorite.findFirst({ where: { userId: favoriteData.userId, productId: favoriteData.productId } });
    if (findFavorite){
      const deleteFavorite = await this.prisma.favorite.delete({ where: { id: findFavorite.id } });
      return {data: deleteFavorite, message: 'Sucessfully Remove Your WishList'};
    }else{
        const createFavoriteData: IFavorite = await prisma.favorite.create({ 
            data: {
                userId: favoriteData.userId,
                productId: favoriteData.productId,
            } 
        });
        return {data: createFavoriteData, message: 'Sucessfully Add Your WishList'};
    }
  }

  public async getUserFavorites(userId: string): Promise<IFavorite[]> {
    try { 
    const findFavorite = await this.prisma.favorite.findMany({ where: { userId: userId } });
    if (!findFavorite) throw new HttpException(409, "No Favorite Product");
    return findFavorite;
    }catch (error) {
        throw new HttpException(500, "Error while fetching user favorite products");
    }
  }

}