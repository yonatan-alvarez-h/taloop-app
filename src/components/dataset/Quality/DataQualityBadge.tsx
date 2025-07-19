import React from "react";
import "./DataQualityBadge.css";

interface DataQualityBadgeProps {
  score: number;
  compact?: boolean;
}

const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({
  score,
  compact = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "#22c55e"; // Verde - Excelente
    if (score >= 80) return "#84cc16"; // Verde claro - Muy bueno
    if (score >= 70) return "#eab308"; // Amarillo - Bueno
    if (score >= 60) return "#f97316"; // Naranja - Regular
    return "#ef4444"; // Rojo - Bajo
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excelente";
    if (score >= 80) return "Muy bueno";
    if (score >= 70) return "Bueno";
    if (score >= 60) return "Regular";
    return "Bajo";
  };

  if (compact) {
    return (
      <div
        className="data-quality-badge-compact"
        style={{
          backgroundColor: getScoreColor(score),
          color: "white",
        }}
        title={`Calidad de datos: ${score}% (${getScoreLabel(score)})`}
      >
        <span className="badge-score">{score}%</span>
      </div>
    );
  }

  return (
    <div
      className="data-quality-badge"
      style={{
        backgroundColor: getScoreColor(score),
        color: "white",
      }}
    >
      <div className="badge-content">
        <span className="badge-score">{score}%</span>
        <span className="badge-label">{getScoreLabel(score)}</span>
      </div>
    </div>
  );
};

export default DataQualityBadge;
