export interface Product {
  id: string;
  productName: string;
  productPrice: number;

  productColor: string;
  productCategory: string;
  productDescription: string;
  productImageUrl: string;
  productQuantity: number | undefined;
}
