import { CategoryController } from '../controllers/category.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export class CategoryRoute implements Routes {
    public path = '/category';
    public router = Router();
    public categoryController = new CategoryController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/create`, upload.single('image'), asyncHandler(AuthMiddleware), asyncHandler(this.categoryController.createCategory));
        this.router.put(`${this.path}/update`, upload.single('image'), asyncHandler(AuthMiddleware), asyncHandler(this.categoryController.updateCategory));
        this.router.get(`${this.path}/get-all`, asyncHandler(AuthMiddleware), asyncHandler(this.categoryController.getAllCategories));
    }
}