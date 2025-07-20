import React from "react";
import "./DatasetFormat.css";

interface DatasetFormatProps {
  type: "CSV" | "JSON" | "XML" | "Excel" | "Parquet" | "SQL" | "API";
  encoding?: "UTF-8" | "UTF-16" | "ASCII" | "ISO-8859-1";
  delimiter?: "," | ";" | "|" | "\t";
  compression?: "none" | "gzip" | "zip" | "bzip2";
}

const DatasetFormat: React.FC<DatasetFormatProps> = ({
  type,
  encoding,
  delimiter,
  compression,
}) => {
  const getFormatIcon = (format: string) => {
    switch (format) {
      case "CSV":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8L14,2M18,20H6V4h7v5h5V20Z" />
          </svg>
        );
      case "JSON":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5,3A2,2,0,0,0,3,5V19a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V5a2,2,0,0,0-2-2H5M5,5H19V19H5V5M7,7V9h2V7H7M7,11v2h2V11H7M7,15v2h2V15H7M15,7v2h2V7H15M15,11v2h2V11H15M15,15v2h2V15H15" />
          </svg>
        );
      case "Excel":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8L14,2M18,20H6V4h7v5h5V20M8,10v2h8V10H8M8,14v2h8V14H8" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8L14,2M18,20H6V4h7v5h5V20Z" />
          </svg>
        );
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case "CSV":
        return "#22c55e";
      case "JSON":
        return "#3b82f6";
      case "XML":
        return "#f59e0b";
      case "Excel":
        return "#10b981";
      case "Parquet":
        return "#8b5cf6";
      case "SQL":
        return "#ef4444";
      case "API":
        return "#6366f1";
      default:
        return "#6c757d";
    }
  };

  const formatDelimiter = (delim: string) => {
    switch (delim) {
      case ",":
        return "Coma (,)";
      case ";":
        return "Punto y coma (;)";
      case "|":
        return "Pipe (|)";
      case "\t":
        return "Tab";
      default:
        return delim;
    }
  };

  return (
    <div className="dataset-format">
      <div className="format-main">
        <div
          className="format-type-badge"
          style={{ backgroundColor: getFormatColor(type) }}
        >
          <div className="format-icon">{getFormatIcon(type)}</div>
          <span className="format-type">{type}</span>
        </div>
      </div>

      <div className="format-details">
        {encoding && (
          <div className="format-detail">
            <span className="format-detail-label">Codificación:</span>
            <span className="format-detail-value">{encoding}</span>
          </div>
        )}

        {delimiter && (
          <div className="format-detail">
            <span className="format-detail-label">Separador:</span>
            <span className="format-detail-value">
              {formatDelimiter(delimiter)}
            </span>
          </div>
        )}

        {compression && compression !== "none" && (
          <div className="format-detail">
            <span className="format-detail-label">Compresión:</span>
            <span className="format-detail-value compression">
              {compression.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetFormat;
