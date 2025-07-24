import React from "react";
import type { DatasetField } from "../../../../../types/dataset";
import { useFieldsTable } from "./hooks/useFieldsTable";
import {
  SearchControls,
  FieldsTable,
  Pagination,
  NoResults,
  SimpleFields,
} from "./components";
import "./DatasetFields.css";

interface DatasetFieldsProps {
  fields: DatasetField[];
  className?: string;
  style?: React.CSSProperties;
  showDetails?: boolean; // Para mostrar tipo y descripción
  itemsPerPage?: number; // Número de elementos por página
}

const DatasetFields: React.FC<DatasetFieldsProps> = ({
  fields,
  className,
  style,
  showDetails = false,
  itemsPerPage = 5,
}) => {
  const {
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filteredFields,
    paginatedFields,
    totalPages,
  } = useFieldsTable({ fields, itemsPerPage });

  // Vista simple con chips
  if (!showDetails) {
    return <SimpleFields fields={fields} className={className} style={style} />;
  }

  // Vista detallada con tabla paginada
  return (
    <div
      className={
        className ? className + " dataset-fields-table" : "dataset-fields-table"
      }
      style={style}
    >
      <SearchControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalFields={fields.length}
        filteredCount={filteredFields.length}
      />

      <FieldsTable fields={paginatedFields} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {filteredFields.length === 0 && searchTerm && (
        <NoResults searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default DatasetFields;
