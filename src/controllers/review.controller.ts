
import { RequestWithUser } from '../interfaces/auth.interface';
import { ReviewService } from '../services/review.service';
import { NextFunction, Request, Response } from 'express';
import { Review, ReviewCreate, ReviewUpdate } from '../interfaces/review.interface';
import { HttpException } from '../exceptions/HttpException';

export class ReviewController {
    private reviewService = new ReviewService();
 
    public createReview = async (request: RequestWithUser, response: Response, next: NextFunction) => {
      try {
        const reviewData: ReviewCreate = request.body;
        const createReviwData = await this.reviewService.createReview(reviewData);
  
        response.status(201).json({ data: createReviwData, message: 'Review Create Sucessfully' });
      } catch (error) {
        next(error);
      }
    };

    public updateReview = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
          const reviewData: ReviewUpdate = request.body;
          const updateReviwData = await this.reviewService.updateReview(reviewData);
    
          response.status(201).json({ data: updateReviwData, message: 'Review Update Sucessfully' });
        } catch (error) {
        next(error);
        }
    };

    public getProductReview = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const productId = request.query.productId as string;
            if (!productId) throw new HttpException(400, 'Product ID is required');
            const reviewData = await this.reviewService.getProductReview(productId);
    
            response.status(200).json({ data: reviewData, message: 'Get Product Review Sucessfully' });
        } catch (error) {
          next(error);
        }
    }

    public deleteReview = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const reviewId = request.query.reviewId as string;
            if (!reviewId) throw new HttpException(400, 'Review ID is required');
            const reviewData = await this.reviewService.deleteReview(reviewId);
    
            response.status(200).json({ data: reviewData, message: 'Delete Product Review Sucessfully' });
        } catch (error) {
          next(error);
        }
    }

}
