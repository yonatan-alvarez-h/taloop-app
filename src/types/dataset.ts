export interface Dataset {
  uid: string;
  title: string;
  category?: string;
  tags: string[];
  description: string;
  fields: string[];
  owner: {
    name: string;
    type: "empresa" | "usuario";
    logoUrl?: string;
    description?: string;
    website?: string;
    email?: string;
  };
  priceUsd: number;
  rating?: number;
  ratingCount?: number;
}
