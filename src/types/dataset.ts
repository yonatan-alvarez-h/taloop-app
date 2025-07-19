// Tipo genérico para samples de datos
export type DataSample = Record<string, string | number | boolean | null>;

// Métricas de calidad de datos
export interface DataQuality {
  // Puntuación general de calidad (0-10)
  overallScore: number;

  // Dimensiones específicas de calidad (0-100%)
  completeness: number; // % de campos sin valores nulos
  accuracy: number; // Nivel de precisión de los datos
  consistency: number; // Uniformidad en formatos y valores
  validity: number; // Cumplimiento de reglas de negocio
  timeliness: number; // Qué tan actualizados están los datos
  uniqueness: number; // % de registros únicos sin duplicados

  // Metadatos adicionales
  totalRecords: number; // Número total de registros
  lastValidated: string; // Fecha de última validación (ISO string)
  validationMethod: "automated" | "manual" | "hybrid"; // Método de validación

  // Issues conocidos (opcional)
  knownIssues?: string[]; // Lista de problemas conocidos

  // Recomendaciones de uso
  recommendedFor?: string[]; // Casos de uso recomendados
  notRecommendedFor?: string[]; // Casos de uso no recomendados
}

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

  // Nueva propiedad de calidad de datos
  dataQuality?: DataQuality;
}

// Dataset extendido con samples para el mock de datos
export interface DatasetWithSamples extends Dataset {
  samples?: DataSample[];
}
