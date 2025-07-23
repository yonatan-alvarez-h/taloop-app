import React from "react";
import "./DatasetTimestamps.css";

interface DatasetTimestampsProps {
  createdAt: string;
  updatedAt: string;
}

const DatasetTimestamps: React.FC<DatasetTimestampsProps> = ({
  createdAt,
  updatedAt,
}) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (isoString: string) => {
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Hace 1 día";
    if (diffDays < 30) return `Hace ${diffDays} días`;
    if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return diffMonths === 1 ? "Hace 1 mes" : `Hace ${diffMonths} meses`;
    }
    const diffYears = Math.floor(diffDays / 365);
    return diffYears === 1 ? "Hace 1 año" : `Hace ${diffYears} años`;
  };

  return (
    <div className="dataset-timestamps">
      <div className="timestamp-item">
        <div className="timestamp-label">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
          Creado
        </div>
        <div className="timestamp-value">
          <span className="timestamp-date">{formatDate(createdAt)}</span>
          <span className="timestamp-ago">({getTimeAgo(createdAt)})</span>
        </div>
      </div>

      <div className="timestamp-item">
        <div className="timestamp-label">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23,4 23,10 17,10"></polyline>
            <polyline points="1,20 1,14 7,14"></polyline>
            <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4L18.36,18.36A9,9,0,0,1,3.51,15"></path>
          </svg>
          Actualizado
        </div>
        <div className="timestamp-value">
          <span className="timestamp-date">{formatDate(updatedAt)}</span>
          <span className="timestamp-ago">({getTimeAgo(updatedAt)})</span>
        </div>
      </div>
    </div>
  );
};

export default DatasetTimestamps;
