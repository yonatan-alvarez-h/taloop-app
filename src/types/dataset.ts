// Tipo genérico para samples de datos
export type DataSample = Record<string, string | number | boolean | null>;

// Definición de campo de dataset con metadata extendida
export interface DatasetField {
  name: string; // Nombre del campo
  index: number; // Índice/orden de la columna en el dataset (empezando en 1)
  type:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "datetime"
    | "email"
    | "url"
    | "enum"
    | "json"
    | "binary"; // Tipo de datos
  description: string; // Descripción del campo
  nullable: boolean; // Si permite valores nulos
  unique: boolean; // Si los valores deben ser únicos
}

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
  fields: DatasetField[]; // Cambiado de string[] a DatasetField[]
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

  // Nuevas características de metadata
  timestamps?: {
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  };

  size?: {
    fileSize: string; // "2.3 GB"
    recordCount: number; // 150000
    columnCount: number; // 25
  };

  format?: {
    type: "CSV" | "JSON" | "XML" | "Excel" | "Parquet" | "SQL" | "API";
    encoding?: "UTF-8" | "UTF-16" | "ASCII" | "ISO-8859-1";
    delimiter?: "," | ";" | "|" | "\t";
    compression?: "none" | "gzip" | "zip" | "bzip2";
  };

  usage?: {
    downloads: number; // 1250
    views: number; // 5680
    apiCalls: number; // 23400
    lastAccessed: string; // "2 horas ago"
  };

  domain?: {
    industry: string; // "Healthcare"
    subDomain?: string; // "Medical Records"
  };
}

// Dataset extendido con samples para el mock de datos
export interface DatasetWithSamples extends Dataset {
  samples?: DataSample[];
}
