
import { RequestWithUser } from '../interfaces/auth.interface';
import { CategoryService } from '../services/category.service';
import { NextFunction, Request, Response } from 'express';
import { Category } from '../interfaces/category.interface';
 

export class CategoryController {
    private cateroryService = new CategoryService();
 
    public createCategory = async (request: Request, response: Response, next: NextFunction) => {
      try {
        const categoryData: Category = request.body;
        const createCategoryData = await this.cateroryService.createCategory(categoryData);
  
        response.status(201).json({ data: createCategoryData, message: 'Category Create Sucessfully' });
      } catch (error) {
        next(error);
      }
    };

    public updateCategory = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const categoryData: Category = request.body;
            const updateCategoryData = await this.cateroryService.updateCategory(categoryData);
      
            response.status(201).json({ data: updateCategoryData, message: 'Category Update Sucessfully' });
        } catch (error) {
          next(error);
        }
      };

}

