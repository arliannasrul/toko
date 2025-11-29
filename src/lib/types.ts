export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageId: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
