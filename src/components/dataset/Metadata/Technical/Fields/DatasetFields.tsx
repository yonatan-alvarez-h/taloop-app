import React from "react";
import type { DatasetField } from "../../../../../types/dataset";
import "./DatasetFields.css";

// Mapeo de iconos para tipos de datos
const TYPE_ICONS = {
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

interface DatasetFieldsProps {
  fields: DatasetField[];
  className?: string;
  style?: React.CSSProperties;
  showDetails?: boolean; // Para mostrar tipo y descripción
}

const DatasetFields: React.FC<DatasetFieldsProps> = ({
  fields,
  className,
  style,
  showDetails = false,
}) => {
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

  // Vista detallada con tabla
  return (
    <div
      className={
        className ? className + " dataset-fields-table" : "dataset-fields-table"
      }
      style={style}
    >
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
          {fields.map((field) => (
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
    </div>
  );
};

export default DatasetFields;
