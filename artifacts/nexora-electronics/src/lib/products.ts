export type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  category: string;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function fetchProducts(): Promise<ApiProduct[]> {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error(`Failed to load products: ${response.status}`);
  }

  return response.json();
}
