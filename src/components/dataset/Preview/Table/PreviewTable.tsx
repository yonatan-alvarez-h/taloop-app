import React from "react";
import type { DataSample, DatasetField } from "../../../../types/dataset";
import { TYPE_ICONS } from "../../../../utils/dataTypes";
import { isNumeric, formatTableValue } from "../../../../utils/numberFormat";
import "./PreviewTable.css";

interface PreviewTableProps {
  fields: DatasetField[];
  data: DataSample[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ fields, data }) => {
  if (data.length === 0) {
    return (
      <div className="dataset-preview-empty">
        No hay datos de ejemplo disponibles para este dataset.
      </div>
    );
  }

  return (
    <div className="dataset-preview-table">
      <table className="preview-table">
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field.name} title={field.description}>
                <div className="preview-header-content">
                  <span className="preview-field-name">{field.name}</span>
                  <span className={`preview-type-icon type-${field.type}`}>
                    {TYPE_ICONS[field.type]}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: Record<string, unknown>, i: number) => (
            <tr key={i}>
              {fields.map((field) => {
                const value = row[field.name];
                const isValueNumeric = isNumeric(value);
                const alignClass = isValueNumeric
                  ? "align-right"
                  : "align-left";
                const formattedValue = formatTableValue(value, isValueNumeric);

                return (
                  <td key={field.name} className={alignClass}>
                    {formattedValue}
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
