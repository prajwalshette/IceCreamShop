import { FavoriteService } from '../services/favorite.service';
import { NextFunction, Request, Response } from 'express';
import { IFavorite } from '../interfaces/favorite.interface';
import { isNull } from 'util';
import { RequestWithUser } from '../interfaces/auth.interface';

export class FavoriteController {

    private favoriteService = new FavoriteService();

    public addAndRemoveFavorite = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
        const favoriteData: IFavorite = request.body as unknown as IFavorite;
        const {data, message} = await this.favoriteService.addAndRemoveFavorite(favoriteData);

        response.status(201).json({ data: data, message: message });
        } catch (error) {
        next(error);
        }
    };

    public getUserFavorites = async (request: RequestWithUser, response: Response, next: NextFunction) => {     
        try {
            const userId = request.user.userDocument.id;
            const favorite = await this.favoriteService.getUserFavorites(userId);

            response.status(200).json({ data: favorite, message: "User Favorite Product" });
        } catch (error) {
            next(error);
        }
    }

}