import React from "react";
import { formatNumber } from "../../../../../utils/numberFormat";
import "./DatasetSize.css";

interface DatasetSizeProps {
  fileSize: string;
  recordCount: number;
  columnCount: number;
}

const DatasetSize: React.FC<DatasetSizeProps> = ({
  fileSize,
  recordCount,
  columnCount,
}) => {
  return (
    <div className="dataset-size">
      <div className="size-metric">
        <div className="size-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8Z"></path>
            <path d="M14,2l6,6"></path>
            <path d="M16,13H8"></path>
            <path d="M16,17H8"></path>
            <path d="M10,9H8"></path>
          </svg>
        </div>
        <div className="size-details">
          <span className="size-value">{fileSize}</span>
          <span className="size-label">Tamaño de archivo</span>
        </div>
      </div>

      <div className="size-metric">
        <div className="size-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3,3V21H21V3Z"></path>
            <path d="M7,7H17"></path>
            <path d="M7,11H17"></path>
            <path d="M7,15H17"></path>
          </svg>
        </div>
        <div className="size-details">
          <span className="size-value">{formatNumber(recordCount)}</span>
          <span className="size-label">Registros</span>
        </div>
      </div>

      <div className="size-metric">
        <div className="size-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12,2V22"></path>
            <path d="M2,12H22"></path>
            <path d="M7.5,7.5L16.5,16.5"></path>
            <path d="M7.5,16.5L16.5,7.5"></path>
          </svg>
        </div>
        <div className="size-details">
          <span className="size-value">{columnCount}</span>
          <span className="size-label">Columnas</span>
        </div>
      </div>
    </div>
  );
};

export default DatasetSize;
