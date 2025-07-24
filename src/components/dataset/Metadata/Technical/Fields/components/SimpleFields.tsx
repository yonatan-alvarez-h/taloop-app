import React from "react";
import type { DatasetField } from "../../../../../../types/dataset";

interface SimpleFieldsProps {
  fields: DatasetField[];
  className?: string;
  style?: React.CSSProperties;
}

const SimpleFields: React.FC<SimpleFieldsProps> = ({
  fields,
  className,
  style,
}) => {
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
};

export default SimpleFields;
