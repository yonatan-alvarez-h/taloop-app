import { useState, useMemo, useEffect } from "react";
import type { DatasetField } from "../../../../../../types/dataset";

interface UseFieldsTableParams {
  fields: DatasetField[];
  itemsPerPage: number;
}

interface UseFieldsTableReturn {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredFields: DatasetField[];
  paginatedFields: DatasetField[];
  totalPages: number;
}

export const useFieldsTable = ({
  fields,
  itemsPerPage,
}: UseFieldsTableParams): UseFieldsTableReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar campos por búsqueda
  const filteredFields = useMemo(() => {
    if (!searchTerm) return fields;
    return fields.filter(
      (field) =>
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fields, searchTerm]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredFields.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFields = filteredFields.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reiniciar página cuando cambie la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return {
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filteredFields,
    paginatedFields,
    totalPages,
  };
};
