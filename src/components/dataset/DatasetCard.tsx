import React from "react";
import type { Dataset } from "../../types/dataset";
import DatasetOwner from "./DatasetOwner";
import DatasetFields from "./DatasetFields";
import DatasetTags from "./DatasetTags";
import categoryColors from "../../data/categoryColors";
// import DatasetPreview from "./DatasetPreview";
import "./DatasetCard.css";

// Tooltip CSS (puedes moverlo a DatasetCard.css si prefieres)
const tooltipStyle = {
  position: "relative" as const,
  display: "inline-block" as const,
};

const tooltipTextStyle = {
  visibility: "hidden" as const,
  width: "260px",
  backgroundColor: "#222",
  color: "#fff",
  textAlign: "left" as const,
  borderRadius: "8px",
  padding: "10px 14px",
  position: "absolute" as const,
  zIndex: 10,
  bottom: "120%",
  left: "50%",
  transform: "translateX(-50%)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
  fontSize: "0.98em",
  opacity: 0,
  transition: "opacity 0.2s",
  pointerEvents: "none" as const,
};

const tooltipTextVisible = {
  ...tooltipTextStyle,
  visibility: "visible" as const,
  opacity: 1,
  pointerEvents: "auto" as const,
};

interface DatasetCardProps {
  dataset: Dataset & { category?: string };
}

const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => (
  <li className="dataset-card">
    {/* Título y precio en la parte superior */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
      }}
    >
      <div
        className="dataset-title"
        style={{
          fontWeight: 700,
          fontSize: "1.13em",
          color: "#222",
          wordBreak: "break-word",
          lineHeight: 1.22,
          flex: 1,
          textAlign: "left",
          marginRight: 8,
        }}
      >
        {dataset.title}
      </div>
      <span
        className="dataset-price"
        style={{
          fontWeight: 600,
          fontSize: "1.08em",
          whiteSpace: "nowrap",
          color: "#2d3748",
          marginLeft: 8,
          background: "none",
          border: "none",
          boxShadow: "none",
          padding: 0,
        }}
      >
        {dataset.priceUsd.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </span>
    </div>
    {/* Descripción */}
    <div style={{ marginBottom: 8 }}>
      <div style={tooltipStyle} className="dataset-description-tooltip-wrapper">
        <span
          className="dataset-description"
          style={{
            cursor: dataset.description.length > 150 ? "pointer" : undefined,
          }}
          onMouseEnter={(e) => {
            const tooltip = e.currentTarget.nextSibling as HTMLElement;
            if (tooltip) Object.assign(tooltip.style, tooltipTextVisible);
          }}
          onMouseLeave={(e) => {
            const tooltip = e.currentTarget.nextSibling as HTMLElement;
            if (tooltip) Object.assign(tooltip.style, tooltipTextStyle);
          }}
        >
          {dataset.description.length > 150
            ? dataset.description.slice(0, 149) + "..."
            : dataset.description}
        </span>
        {dataset.description.length > 150 && (
          <span style={tooltipTextStyle} className="dataset-tooltip-text">
            {dataset.description}
          </span>
        )}
      </div>
    </div>
    {/* Categoría y tags */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 2,
        gap: 8,
        minWidth: 0,
      }}
    >
      {/* Categoría */}
      {dataset.category &&
        (() => {
          const color =
            categoryColors[dataset.category.toLowerCase()] || "#6366f1";
          return (
            <div
              className="dataset-category"
              style={{
                flex: "0 1 35%",
                maxWidth: "35%",
                minWidth: 0,
                textAlign: "left",
                fontSize: "1em",
                color: "#fff",
                background: color,
                padding: "2px 14px",
                borderRadius: 16,
                fontWeight: 600,
                letterSpacing: "0.01em",
                textTransform: "capitalize",
                boxShadow: `0 1px 6px ${color}22`,
                marginBottom: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {dataset.category}
            </div>
          );
        })()}
      {/* Owner */}
      <div
        className="dataset-owner ms-3"
        style={{
          flex: "0 1 80%",
          maxWidth: "80%",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: "1.04em",
          fontWeight: 500,
        }}
      >
        <DatasetOwner owner={dataset.owner} />
      </div>
    </div>
    <div
      style={{
        width: "100%",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
      }}
    >
      <DatasetTags
        tags={dataset.tags.slice(0, 4)}
        style={{ gap: 4, flexWrap: "wrap", minWidth: 0, overflow: "hidden" }}
      />
      {dataset.tags.length > 4 && (
        <span style={{ color: "#888", fontSize: "0.95em", marginLeft: 6 }}>
          +{dataset.tags.length - 4} más
        </span>
      )}
    </div>
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: 0, gap: 8 }}
    >
      <div className="dataset-fields" style={{ flex: 1 }}>
        <span className="fw-bold">Campos:</span>{" "}
        <DatasetFields
          fields={dataset.fields.slice(0, 5)}
          style={{ gap: 5, paddingTop: 2 }}
        />
        {dataset.fields.length > 6 && (
          <span style={{ color: "#888", fontSize: "0.95em", marginLeft: 6 }}>
            +{dataset.fields.length - 5} más
          </span>
        )}
      </div>
      <button
        className="btn btn-outline-primary btn-sm"
        style={{
          fontWeight: 500,
          letterSpacing: 0.2,
          borderRadius: 6,
          minWidth: 110,
          padding: "4px 18px",
        }}
        onClick={() => window.open(`/datasets/${dataset.id}`, "_self")}
      >
        Ver detalles
      </button>
    </div>
  </li>
);

export default DatasetCard;
