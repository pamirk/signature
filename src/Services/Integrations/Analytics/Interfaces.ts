export interface AnalyticsData {
  event: string;
  [key: string]: any; // Allows additional properties with any key-value pairs
}

export interface EcommerceItem {
  id: string;
  name: string;
  category?: string;
  price?: number;
  quantity?: number;
  [key: string]: any; // Allows additional properties with any key-value pairs
}