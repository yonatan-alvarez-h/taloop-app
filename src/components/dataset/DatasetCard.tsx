import React from "react";
import type { Dataset } from "../../types/dataset";
import DatasetOwner from "./DatasetOwner";
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
            cursor: dataset.description.length > 100 ? "pointer" : undefined,
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
          {dataset.description.length > 100
            ? dataset.description.slice(0, 99) + "..."
            : dataset.description}
        </span>
        {dataset.description.length > 100 && (
          <span style={tooltipTextStyle} className="dataset-tooltip-text">
            {dataset.description}
          </span>
        )}
      </div>
    </div>
    {/* Categoría y tags */}
    {dataset.category && (
      <div
        className="dataset-category"
        style={{
          width: "100%",
          textAlign: "left",
          fontSize: "0.98em",
          color: "#4a5568",
          marginBottom: 4,
          fontWeight: 500,
          letterSpacing: "0.01em",
          textTransform: "capitalize",
        }}
      >
        {dataset.category}
      </div>
    )}
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 8 }}
    >
      <div
        className="dataset-tags"
        style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 4 }}
      >
        {dataset.tags.map((tag) => (
          <span key={tag} className="dataset-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="dataset-owner ms-3" style={{ flexShrink: 0 }}>
        <DatasetOwner owner={dataset.owner} />
      </div>
    </div>
    <div className="dataset-fields">
      <span className="fw-bold">Campos:</span> {dataset.fields.join(", ")}
    </div>
    <button
      className="btn btn-outline-primary btn-sm mt-2 w-100"
      style={{ fontWeight: 500, letterSpacing: 0.2, borderRadius: 6 }}
      onClick={() => window.open(`/datasets/${dataset.id}`, "_self")}
    >
      Ver detalles
    </button>
  </li>
);

export default DatasetCard;
