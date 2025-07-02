import React from "react";
import type { Dataset } from "../../types/dataset";
import DatasetOwner from "./DatasetOwner";
import "./DatasetCard.css";

interface DatasetDetailsProps {
  dataset: Dataset;
}

const DatasetDetails: React.FC<DatasetDetailsProps> = ({ dataset }) => {
  return (
    <div
      className="dataset-details-container"
      style={{
        maxWidth: 700,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.5em",
            color: "#222",
            flex: 1,
            wordBreak: "break-word",
          }}
        >
          {dataset.title}
        </div>
        <span
          style={{
            fontWeight: 600,
            fontSize: "1.15em",
            color: "#2d3748",
            marginLeft: 16,
          }}
        >
          {dataset.priceUsd.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      </div>
      {dataset.category && (
        <div
          style={{
            color: "#4a5568",
            fontWeight: 500,
            fontSize: "1.05em",
            marginBottom: 10,
            textTransform: "capitalize",
          }}
        >
          {dataset.category}
        </div>
      )}
      <div
        style={{
          marginBottom: 18,
          color: "#444",
          fontSize: "1.08em",
          lineHeight: 1.6,
        }}
      >
        {dataset.description}
      </div>
      <div style={{ marginBottom: 18 }}>
        <span className="fw-bold">Campos:</span> {dataset.fields.join(", ")}
      </div>
      <div
        style={{ marginBottom: 18, display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {dataset.tags.map((tag) => (
          <span
            key={tag}
            className="dataset-tag"
            style={{ fontSize: "0.98em" }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div style={{ marginBottom: 18 }}>
        <DatasetOwner owner={dataset.owner} />
      </div>
      {/* Aquí puedes agregar más detalles, vistas previas, ejemplos, etc. */}
    </div>
  );
};

export default DatasetDetails;
