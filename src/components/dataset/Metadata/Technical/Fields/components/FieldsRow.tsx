import React from "react";
import type { DatasetField } from "../../../../../../types/dataset";
import { TYPE_ICONS } from "../../../../../../utils/dataTypes";

interface FieldsRowProps {
  field: DatasetField;
}

const FieldsRow: React.FC<FieldsRowProps> = ({ field }) => {
  return (
    <tr>
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
  );
};

export default FieldsRow;
