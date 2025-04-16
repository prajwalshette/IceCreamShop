import { HttpException } from '../exceptions/HttpException';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import prisma from '../database';
import { IProduct } from '../interfaces/product.interface';


@Service()
export class ProductService {
  private prisma = prisma;

  public async createProduct(productData: IProduct): Promise<IProduct > {
    try{
      const findProduct = await this.prisma.category.findUnique({ where: { name:  productData.name } });
      if (findProduct) throw new HttpException(409, `Product (${productData.name}) already exists`);

      const price = parseFloat(productData.price as unknown as string);

      const createProductData: IProduct = await prisma.product.create({ 
          data: {
            name: productData.name,
            description: productData.description,
            price: price,
            imageUrl: productData.imageUrl,
            isAvailable: productData.isAvailable,
            categoryId: productData.categoryId,
          } 
      });
      return createProductData;
    }catch (error) {  
      throw new HttpException(500, `Error creating product (${productData.name})`);
    };
}

public async updateProduct(productData: IProduct): Promise<IProduct> {
  try{
    const findProduct = await this.prisma.category.findUnique({ where: { id:  productData.id } });
    if (!findProduct) throw new HttpException(404, `Product (${productData.id}) Not Found`);

    const price = parseFloat(productData.price as unknown as string);

    const updateProductData: IProduct = await prisma.product.update({ 
        where: { id: productData.id},
        data: {
          name: productData.name,
          description: productData.description,
          price: price,
          imageUrl: productData.imageUrl,
          isAvailable: productData.isAvailable,
          categoryId: productData.categoryId,
        } 
    });
    return updateProductData;
  }catch (error) {
    throw new HttpException(500, `Error updating product (${productData.id})`);
  }
};

public async getAllProducts(): Promise<IProduct[]> {
  try{
    const allProducts = await this.prisma.product.findMany({ where: { isDeleted: false } });
    if (!allProducts) throw new HttpException(404, `Products Not Found`);
    return allProducts;
  }catch (error) {
    throw new HttpException(500, `Error getting all products`);
  }
};

public async getProductById(productId: string): Promise<IProduct> {
  try{
    const product = await this.prisma.product.findUnique({ where: { id: productId, isDeleted: false } });
    if (!product) throw new HttpException(404, `Product (${productId}) Not Found`);
    return product;
  }catch (error) {
    throw new HttpException(500, `Error getting product (${productId})`);
  }
};

public async getProductsByCategory(categoryId: string): Promise<IProduct[]> {
  try{
    const products = await this.prisma.product.findMany({ where: { categoryId: categoryId, isDeleted: false } });
    if (!products) throw new HttpException(404, `Products (${categoryId}) Not Found`);
    return products;  
  }catch (error) {
    throw new HttpException(500, `Error getting products (${categoryId})`);
  }
};

public async deleteProduct(productId: string): Promise<IProduct> {
  try{
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new HttpException(404, `Product (${productId}) Not Found`);

    const deleteProductData: IProduct = await prisma.product.update({ 
        where: { id: productId },
        data: {
          isDeleted: true,
        }
    });
    return deleteProductData;
  }catch (error) {
    throw new HttpException(500, `Error deleting product (${productId})`);
}
};

public async searchProduct(search: string): Promise<IProduct[]> {
  try {
    const products = await this.prisma.product.findMany({ where: { isDeleted: false, name: { contains: search } } });
    if (!products) throw new HttpException(404, `Products (${search}) Not Found`);
    return products;    
  }catch (error) {
    throw new HttpException(500, `Error searching product (${search})`);
  }
}

}