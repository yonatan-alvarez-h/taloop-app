// Tipo genérico para samples de datos
export type DataSample = Record<string, string | number | boolean | null>;

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

// Dataset extendido con samples para el mock de datos
export interface DatasetWithSamples extends Dataset {
  samples?: DataSample[];
}
