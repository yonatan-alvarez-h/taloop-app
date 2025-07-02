import React from "react";
import "./DatasetFields.css";

interface DatasetFieldsProps {
  fields: string[];
  className?: string;
  style?: React.CSSProperties;
}

const DatasetFields: React.FC<DatasetFieldsProps> = ({
  fields,
  className,
  style,
}) => (
  <div
    className={className ? className + " dataset-fields" : "dataset-fields"}
    style={style}
  >
    {fields.map((field) => (
      <span key={field} className="dataset-field-chip">
        {field}
      </span>
    ))}
  </div>
);

export default DatasetFields;
