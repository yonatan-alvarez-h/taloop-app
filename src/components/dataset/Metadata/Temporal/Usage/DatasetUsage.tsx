import React from "react";
import "./DatasetUsage.css";

interface DatasetUsageProps {
  downloads: number;
  views: number;
  apiCalls: number;
}

const DatasetUsage: React.FC<DatasetUsageProps> = ({
  downloads,
  views,
  apiCalls,
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const getPopularityLevel = (downloads: number) => {
    if (downloads >= 10000) return { level: "Muy Popular", color: "#22c55e" };
    if (downloads >= 5000) return { level: "Popular", color: "#3b82f6" };
    if (downloads >= 1000) return { level: "Moderado", color: "#f59e0b" };
    return { level: "Nuevo", color: "#6c757d" };
  };

  const popularity = getPopularityLevel(downloads);

  return (
    <div className="dataset-usage">
      <div className="usage-header">
        <div
          className="popularity-badge"
          style={{ backgroundColor: popularity.color }}
        >
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
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"></polygon>
          </svg>
          {popularity.level}
        </div>
      </div>

      <div className="usage-stats">
        <div className="usage-stat">
          <div className="stat-icon downloads">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21,15V19A2,2,0,0,1,19,21H5A2,2,0,0,1,3,19V15"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <div className="stat-details">
            <span className="stat-value">{formatNumber(downloads)}</span>
            <span className="stat-label">Descargas</span>
          </div>
        </div>

        <div className="usage-stat">
          <div className="stat-icon views">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1,12S5,4,12,4,23,12,23,12,19,20,12,20,1,12,1,12Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className="stat-details">
            <span className="stat-value">{formatNumber(views)}</span>
            <span className="stat-label">Visualizaciones</span>
          </div>
        </div>

        <div className="usage-stat">
          <div className="stat-icon api">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16,18 22,12 16,6"></polyline>
              <polyline points="8,6 2,12 8,18"></polyline>
            </svg>
          </div>
          <div className="stat-details">
            <span className="stat-value">{formatNumber(apiCalls)}</span>
            <span className="stat-label">Llamadas API</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetUsage;
