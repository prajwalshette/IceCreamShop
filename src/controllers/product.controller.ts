import { ProductService } from '../services/product.service';
import { NextFunction, Request, Response } from 'express';
import { IProduct } from '../interfaces/product.interface';
import { RequestWithUser } from '../interfaces/auth.interface';
import { HttpException } from '../exceptions/HttpException';

export class ProductController {

    private productService = new ProductService();
     
    public createProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
        const productData: IProduct = request.body;
        const createProductData = await this.productService.createProduct(productData);
    
        response.status(201).json({ data: createProductData, message: 'Product Create Sucessfully' });
        } catch (error) {
        next(error);
        }
    };

    public updateProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const productData: IProduct = request.body;
            const updateProductData = await this.productService.updateProduct(productData);
        
            response.status(201).json({ data: updateProductData, message: 'Product Update Sucessfully' });
        } catch (error) {
            next(error);
        }
    };

    public getAllProducts = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const allProducts = await this.productService.getAllProducts();
        
            response.status(200).json({ data: allProducts, message: 'All Products' });
        } catch (error) {
            next(error);
        }
    };

    public getProductById = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const productId = request.query.productId as string;
            if (!productId) throw new HttpException(400, 'Product ID is required');
            const product = await this.productService.getProductById(productId);
        
            response.status(200).json({ data: product, message: 'Product' });
        } catch (error) {
            next(error);
        }
    };

    public getProductsByCategory = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const categoryId = request.query.categoryId as string;
            if (!categoryId) throw new HttpException(400, 'Category ID is required');
            const products = await this.productService.getProductsByCategory(categoryId);
        
            response.status(200).json({ data: products, message: 'Products' });
        } catch (error) {
            next(error);
        }
    };

    public deleteProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const productId = request.query.productId as string;
            if (!productId) throw new HttpException(400, 'Product ID is required');
            const deleteProductData = await this.productService.deleteProduct(productId);
        
            response.status(200).json({ data: deleteProductData, message: 'Product Deleted' });
        } catch (error) {
            next(error);
        }
    };

    public searchProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const searchQuery = request.query.searchQuery as string;
            if (!searchQuery) throw new HttpException(400, 'Search Query is required');
            const products = await this.productService.searchProduct(searchQuery);
        
            response.status(200).json({ data: products, message: 'Products' });
        } catch (error) {
            next(error);
        }
    }

}