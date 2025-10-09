export interface AITool {
  name: string;
  icon?: React.ElementType;
  svg?: React.ReactNode;
  description: string;
  status: 'primary' | 'active' | 'occasional' | string;
  link?: string;
  usage?: string;
  hasUsage?: boolean;
  price?: number;
  discountedPrice?: number;
}

export interface FavoriteModel {
  name: string;
  provider: string;
  review: string;
  rating: number; // 1.0 - 10.0 scale
}

export interface AIReview {
  tool: string;
  rating: number; // 1.0 - 10.0 scale
  pros: string[];
  cons: string[];
  verdict: string;
}
