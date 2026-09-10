import React from "react";
import type { DatasetField } from "../../../../../../types/dataset";
import { TYPE_ICONS } from "../../../../../../utils/dataTypes";

interface FieldsRowProps {
  field: DatasetField;
  compact?: boolean;
}

const FieldsRow: React.FC<FieldsRowProps> = ({ field, compact = false }) => {
  return (
    <tr>
      {!compact && <td className="field-index">{field.index}</td>}
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
      {!compact && (
        <td className="field-nullable">
          <div className="nullable-checkbox-container">
            <input
              type="checkbox"
              checked={field.nullable}
              readOnly
              disabled
              className="nullable-checkbox"
              title={
                field.nullable
                  ? "Permite valores nulos"
                  : "No permite valores nulos"
              }
            />
            <span className="nullable-label">{field.nullable ? "Sí" : "No"}</span>
          </div>
        </td>
      )}
    </tr>
  );
};

export default FieldsRow;
