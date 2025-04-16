
import { RequestWithUser } from '../interfaces/auth.interface';
import { CategoryService } from '../services/category.service';
import { NextFunction, Response } from 'express';
import { Category } from '../interfaces/category.interface';
import { uploadCategoryImage } from '../services/firebase.service';

interface FileWithBuffer extends Express.Multer.File {
  buffer: Buffer;
  originalname: string;
  fieldname: string;
  encoding: string;
  mimetype: string;
  size: number;
}

export class CategoryController {
    private cateroryService = new CategoryService();
 
    public createCategory = async (request: RequestWithUser, response: Response, next: NextFunction): Promise<void> => {
      try {
        const categoryData: Category = request.body;
        const image = request.file;
        if (!image) {
          throw new Error('No images provided');
        }
        const imageUrl = await uploadCategoryImage(image as unknown as FileWithBuffer);

        if (!imageUrl) {
          throw new Error('Image upload failed');
        }
        const createCategoryData = await this.cateroryService.createCategory({ ...categoryData, imageUrl });
  
        response.status(201).json({ data: createCategoryData, message: 'Category Create Sucessfully' });
      } catch (error) {
        next(error);
      }
    };

    public updateCategory = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const categoryData: Category = request.body;
            const image = request.file;
            let imageUrl: string | undefined;

            if(image){
              imageUrl = await uploadCategoryImage(image as unknown as FileWithBuffer);
              if (!imageUrl) {
                  throw new Error('Image upload failed');
              }
            }
    
            const updateCategoryData = await this.cateroryService.updateCategory({...categoryData, imageUrl: imageUrl ? imageUrl : categoryData.imageUrl});

            response.status(201).json({ data: updateCategoryData, message: 'Category Update Sucessfully' });
        } catch (error) {
          next(error);
        }
  };

  public getAllCategories = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const categoryData = await this.cateroryService.getAllCategories();
      response.status(200).json({ data: categoryData, message: 'Get All Category Sucessfully' });
    } catch (error) {
      next(error);
    }
  }

}

