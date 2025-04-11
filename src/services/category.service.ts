import { HttpException } from '../exceptions/HttpException';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import prisma from '../database';
import { Category } from '../interfaces/category.interface';


@Service()
export class CategoryService {
  private prisma = prisma;

public createCategory = async (categoryData: Category): Promise<Category> => {
    const findCategory = await this.prisma.category.findUnique({ where: { name:  categoryData.name } });
    if (findCategory) throw new HttpException(409, `Category (${categoryData.name}) already exists`);

    const createUserData: Category = await prisma.category.create({ 
        data: {
            name: categoryData.name,
            description: categoryData.description,
            imageUrl: categoryData.imageUrl,
        } 
    });
    return createUserData;
}

public async updateCategory(categoryData: Category): Promise<Category> {
    const findCategory = await this.prisma.category.findUnique({ where: { id:  categoryData.id } });
    if (!findCategory) throw new HttpException(404, `Category (${categoryData.id}) Not Found`);

    const updateCategoryData: Category = await prisma.category.update({ 
        where: { id: categoryData.id},
        data: {
            name: categoryData.name,
            description: categoryData.description,
            imageUrl: categoryData.imageUrl,
        } 
    });
    return updateCategoryData;
}

}