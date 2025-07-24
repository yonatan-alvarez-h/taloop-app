// Constantes y utilidades para tipos de datos de datasets

// Mapeo de iconos para tipos de datos
export const TYPE_ICONS = {
  string: "T",
  number: "#",
  boolean: "•",
  date: "📅",
  datetime: "⏰",
  email: "@",
  url: "↗",
  enum: "≡",
  json: "{}",
  binary: "⬢",
} as const;

// Tipo derivado para asegurar que solo usamos tipos válidos
export type DataType = keyof typeof TYPE_ICONS;

// Función helper para obtener el icono de un tipo
export const getTypeIcon = (type: DataType): string => {
  return TYPE_ICONS[type] || "?";
};

// Función helper para verificar si un tipo es válido
export const isValidDataType = (type: string): type is DataType => {
  return type in TYPE_ICONS;
};
