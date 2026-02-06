export interface ProductNutriments {
  energy_kcal_100g: number;
  proteins_100g: number;
  carbohydrates_100g: number;
  fat_100g: number;
}

export interface Product {
  code: string;
  product_name: string;
  brands: string;
  image_url: string;
  categories: string;
  nutriments: ProductNutriments;
  simulated_price: number;
}

export interface SearchHistoryItem {
  code: string;
  product_name: string;
  image_url: string;
  searched_at: string;
}

export interface OpenFoodFactsResponse {
  status: number;
  status_verbose?: string;
  product?: {
    code: string;
    product_name?: string;
    brands?: string;
    image_url?: string;
    categories?: string;
    nutriments?: {
      "energy-kcal_100g"?: number;
      proteins_100g?: number;
      carbohydrates_100g?: number;
      fat_100g?: number;
    };
  };
}
