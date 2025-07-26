/**
 * Utilidades para formateo de números
 */

/**
 * Formatea un número agregando separadores de miles
 * @param value - El valor a formatear
 * @param locale - Locale para el formateo (por defecto 'es-ES' para España)
 * @returns El número formateado como string
 */
export const formatNumber = (
  value: unknown,
  locale: string = "es-ES"
): string => {
  // Si no es un valor válido, retornar como está
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  // Convertir a número
  const numValue = Number(value);

  // Si no es un número válido, retornar el valor original como string
  if (isNaN(numValue)) {
    return String(value);
  }

  // Formatear el número con separadores de miles
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 10, // Preservar hasta 10 decimales
      useGrouping: true, // Usar separadores de miles
    }).format(numValue);
  } catch (error) {
    // Fallback en caso de error
    return String(value);
  }
};

/**
 * Determina si un valor es numérico
 * @param value - El valor a evaluar
 * @returns true si el valor es numérico
 */
export const isNumeric = (value: unknown): boolean => {
  return (
    typeof value === "number" ||
    (!isNaN(Number(value)) &&
      value !== null &&
      value !== "" &&
      typeof value !== "boolean")
  );
};

/**
 * Formatea un valor para mostrar en tabla
 * @param value - El valor a formatear
 * @param isNumeric - Si el valor es numérico
 * @returns El valor formateado para mostrar
 */
export const formatTableValue = (
  value: unknown,
  isNumeric: boolean
): string => {
  if (value === null || value === undefined) {
    return "-";
  }

  if (isNumeric) {
    return formatNumber(value);
  }

  return String(value);
};
