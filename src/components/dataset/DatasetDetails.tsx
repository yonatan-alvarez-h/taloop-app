import React from "react";
import type { Dataset } from "../../types/dataset";
import DatasetOwner from "./DatasetOwner";
import DatasetPreview from "./DatasetPreview";
import DatasetFields from "./DatasetFields";
import DatasetTags from "./DatasetTags";
import categoryColors from "../../data/categoryColors";
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
      {dataset.category && (() => {
        const color = categoryColors[dataset.category.toLowerCase()] || '#6366f1';
        return (
          <div
            className="dataset-category"
            style={{
              width: "fit-content",
              textAlign: "left",
              fontSize: "1.08em",
              color: "#fff",
              background: color,
              padding: "3px 18px",
              borderRadius: 18,
              marginBottom: 14,
              fontWeight: 600,
              letterSpacing: "0.01em",
              textTransform: "capitalize",
              boxShadow: `0 1px 6px ${color}22`,
            }}
          >
            {dataset.category}
          </div>
        );
      })()}

      {/* Descripción + Tags */}
      <div style={{
        marginBottom: 18,
        color: "#444",
        fontSize: "1.08em",
        lineHeight: 1.6,
        borderBottom: "1.5px solid #e5e7eb",
        paddingBottom: 12
      }}>
        <div>{dataset.description}</div>
        <div style={{ marginTop: 10 }}>
          <DatasetTags tags={dataset.tags} />
        </div>
      </div>

      {/* Owner */}
      <div style={{
        marginBottom: 18,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        borderBottom: "1.5px solid #e5e7eb",
        paddingBottom: 12
      }}>
        <DatasetOwner owner={dataset.owner} />
      </div>

      {/* Campos */}
      <div style={{
        marginBottom: 18,
        borderBottom: "1.5px solid #e5e7eb",
        paddingBottom: 12
      }}>
        <span className="fw-bold">Campos:</span>{" "}
        <DatasetFields fields={dataset.fields} />
      </div>

      {/* Vista previa */}
      <div style={{ marginBottom: 0 }}>
        <h6 className="fw-bold mb-2" style={{ color: "#2d3748" }}>
          Vista previa
        </h6>
        <DatasetPreview dataset={dataset} />
      </div>
    </div>
  );
};

export default DatasetDetails;
