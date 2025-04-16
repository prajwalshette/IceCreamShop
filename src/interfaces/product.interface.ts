export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  isDeleted: boolean;
  categoryId: string;
}
