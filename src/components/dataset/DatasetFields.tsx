import React from "react";

interface DatasetFieldsProps {
  fields: string[];
  className?: string;
  style?: React.CSSProperties;
}

const DatasetFields: React.FC<DatasetFieldsProps> = ({ fields, className, style }) => (
  <span className={className} style={{ display: "inline-flex", flexWrap: "wrap", gap: 8, ...style }}>
    {fields.map((field) => (
      <span
        key={field}
        style={{
          background: "#f1f5f9",
          borderRadius: 6,
          padding: "2px 10px",
          fontSize: "0.97em",
          marginRight: 6,
          marginBottom: 2,
          color: "#374151",
          border: "1px solid #e2e8f0",
        }}
      >
        {field}
      </span>
    ))}
  </span>
);

export default DatasetFields;
