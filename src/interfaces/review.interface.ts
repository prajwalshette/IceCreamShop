export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  isDeleted: boolean;
  created_at: Date;
  updated_at?: Date | null;
  userId: string;
  productId: string;
}
export interface ReviewCreate {
  rating: number;
  comment?: string;
  userId: string;
  productId: string;
}
export interface ReviewUpdate {
  id: string;
  rating?: number;
  comment?: string;
  isDeleted?: boolean;
  userId?: string;
  productId?: string;
}