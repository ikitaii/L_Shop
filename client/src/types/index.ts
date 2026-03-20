export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}