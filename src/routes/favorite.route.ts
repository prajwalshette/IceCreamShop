import { FavoriteController } from '../controllers/favorite.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';

export class FavoriteRoute implements Routes {
    public path = '/favorite';
    public router = Router();
    public favoriteController = new FavoriteController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/add-or-remove`, asyncHandler(AuthMiddleware), asyncHandler(this.favoriteController.addAndRemoveFavorite));
        this.router.get(`${this.path}/user-product`, asyncHandler(AuthMiddleware), asyncHandler(this.favoriteController.getUserFavorites));
    }
}
