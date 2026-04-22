export interface Food {
  id: number;
  name: string;
  region: string;
  city: string;
  emoji: string;
  rating: number;
  price: string;
  reviews: number;
  desc: string;
  tags: string[];
  type: string;
  featured: boolean;
  latest: boolean;
}

export interface Recommendation {
  id: string;
  restaurant_name: string;
  food_name: string;
  region: string;
  rating: number;
  comment: string;
  created_at: string;
}

export type PageId = 'home' | 'search' | 'map' | 'recommend' | 'account' | 'detail';
