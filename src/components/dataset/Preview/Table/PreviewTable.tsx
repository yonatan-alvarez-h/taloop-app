import React from "react";
import type { DataSample, DatasetField } from "../../../../types/dataset";
import "./PreviewTable.css";

interface PreviewTableProps {
  fields: DatasetField[];
  data: DataSample[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ fields, data }) => {
  // Helper para determinar si un valor es numérico
  const isNumeric = (value: unknown) => {
    return (
      typeof value === "number" ||
      (!isNaN(Number(value)) &&
        value !== null &&
        value !== "" &&
        typeof value !== "boolean")
    );
  };

  if (data.length === 0) {
    return (
      <div className="dataset-preview-empty">
        No hay datos de ejemplo disponibles para este dataset.
      </div>
    );
  }

  return (
    <div className="dataset-preview-table">
      <table className="table table-sm table-bordered mt-2 mb-0">
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field.name} title={field.description}>
                {field.name}
                <span className="field-type-badge">({field.type})</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: Record<string, unknown>, i: number) => (
            <tr key={i}>
              {fields.map((field) => {
                const value = row[field.name];
                const alignClass = isNumeric(value)
                  ? "align-right"
                  : "align-left";
                return (
                  <td key={field.name} className={alignClass}>
                    {value !== undefined && value !== null
                      ? String(value)
                      : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewTable;
