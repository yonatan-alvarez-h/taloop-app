import React, { useState, useMemo } from "react";
import type { DatasetField } from "../../../../../types/dataset";
import { TYPE_ICONS } from "../../../../../utils/dataTypes";
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
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Vista simple con chips
  if (!showDetails) {
    return (
      <div
        className={className ? className + " dataset-fields" : "dataset-fields"}
        style={style}
      >
        {fields.map((field) => (
          <span key={field.name} className="dataset-field-chip">
            {field.name}
          </span>
        ))}
      </div>
    );
  }

  // Vista detallada con tabla paginada
  return (
    <div
      className={
        className ? className + " dataset-fields-table" : "dataset-fields-table"
      }
      style={style}
    >
      {/* Controles superiores */}
      <div className="fields-controls">
        <div className="fields-search">
          <input
            type="text"
            placeholder="Buscar columnas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fields-search-input"
          />
          <span className="fields-search-icon">🔍</span>
        </div>
        <div className="fields-summary">
          {filteredFields.length !== fields.length && (
            <span className="fields-filtered">
              {filteredFields.length} de {fields.length} columnas
            </span>
          )}
          {filteredFields.length === fields.length && (
            <span className="fields-total">
              {fields.length} columna{fields.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Tabla */}
      <table className="fields-table">
        <thead>
          <tr>
            <th title="Índice de la columna en el dataset">#</th>
            <th>Columna</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Acepta Nulos</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFields.map((field) => (
            <tr key={field.name}>
              <td className="field-index">{field.index}</td>
              <td className="field-name">
                {field.unique && (
                  <span className="primary-key-icon" title="Columna única">
                    🔑
                  </span>
                )}
                {field.name}
              </td>
              <td className="field-type">
                <div className="type-container">
                  <span className={`type-icon-badge type-${field.type}`}>
                    {TYPE_ICONS[field.type]}
                  </span>
                  <span className="type-text">{field.type}</span>
                </div>
              </td>
              <td className="field-description">{field.description}</td>
              <td className="field-nullable">
                <span
                  className={`nullable-check ${
                    field.nullable ? "nullable" : "not-nullable"
                  }`}
                  title={
                    field.nullable
                      ? "Permite valores nulos"
                      : "No permite valores nulos"
                  }
                >
                  {field.nullable ? "✓" : "✗"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="fields-pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-btn pagination-prev"
          >
            ← Anterior
          </button>

          <div className="pagination-info">
            Página {currentPage} de {totalPages}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="pagination-btn pagination-next"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {filteredFields.length === 0 && searchTerm && (
        <div className="fields-no-results">
          No se encontraron columnas que coincidan con "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default DatasetFields;
