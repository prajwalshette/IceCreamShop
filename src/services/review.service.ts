import { HttpException } from "../exceptions/HttpException";
import { Service } from "typedi";
import prisma from "../database";
import {
  ReviewCreate,
  ReviewUpdate,
  Review,
} from "../interfaces/review.interface";

@Service()
export class ReviewService {
  private prisma = prisma;

  public async createReview(reviewData: ReviewCreate): Promise<Review> {
    try {
      const createReviewData: Review = await this.prisma.review.create({
        data: {
          rating: reviewData.rating,
          comment: reviewData.comment,
          userId: reviewData.userId,
          productId: reviewData.productId,
        },
      });
      return createReviewData;
    } catch (error) {
      throw new HttpException(500, "Error creating review");
    }
  };

    public async updateReview(reviewData: ReviewUpdate): Promise<Review> {
        try {
        const findReview = await this.prisma.review.findUnique({
            where: { id: reviewData.id },
        });
        if (!findReview)
            throw new HttpException(404, `Review (${reviewData.id}) Not Found`);
    
        const updateReviewData: Review = await this.prisma.review.update({
            where: { id: reviewData.id },
            data: {
            rating: reviewData.rating,
            comment: reviewData.comment,
            },
        });
        return updateReviewData;
        } catch (error) {
        throw new HttpException(500, "Error updating review");
        }
    };

    public async getProductReview(productId: string): Promise<Review[]> {
        try {
            const reviewData = await this.prisma.review.findMany({
                where: { productId: productId },
            });
            return reviewData;
        } catch (error) {
            throw new HttpException(500, "Error fetching reviews");
        }
    };

    public async deleteReview(reviewId: string): Promise<Review> {
        try {
            const findReview = await this.prisma.review.findUnique({
                where: { id: reviewId },
            });
            if (!findReview)
                throw new HttpException(404, `Review (${reviewId}) Not Found`);

            const deleteReviewData: Review = await this.prisma.review.update({
                where: { id: reviewId },
                data: {
                    isDeleted: true,
                },
            });
            return deleteReviewData;
        } catch (error) {
            throw new HttpException(500, "Error deleting review");
        }
    };

}
