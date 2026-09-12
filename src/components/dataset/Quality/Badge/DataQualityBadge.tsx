import React from "react";
import "./DataQualityBadge.css";

interface DataQualityBadgeProps {
  /** Quality score percentage (0-100) */
  score: number;
  /** Whether to show compact version */
  compact?: boolean;
}

/**
 * DataQualityBadge component displays a quality score with visual styling
 * based on the score value. Uses gradient backgrounds and modern styling.
 *
 * Score ranges:
 * - 90-100: Excellent (green)
 * - 80-89: Very good (lime)
 * - 70-79: Good (amber)
 * - 60-69: Regular (orange)
 * - 0-59: Low (red)
 *
 * @example
 * // Full badge
 * <DataQualityBadge score={85} />
 *
 * // Compact version
 * <DataQualityBadge score={85} compact />
 */
const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({
  score,
  compact = false,
}) => {
  const getScoreLevel = (qualityScore: number) => {
    if (qualityScore >= 90) return "excellent";
    if (qualityScore >= 80) return "very-good";
    if (qualityScore >= 70) return "good";
    if (qualityScore >= 60) return "regular";
    return "low";
  };
  const getScoreColor = (score: number) => {
    if (score >= 90) return "linear-gradient(135deg, #10b981 0%, #059669 100%)"; // Verde esmeralda - Excelente
    if (score >= 80) return "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)"; // Verde lima - Muy bueno
    if (score >= 70) return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"; // Ámbar - Bueno
    if (score >= 60) return "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"; // Naranja - Regular
    return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"; // Rojo - Bajo
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
        className={`data-quality-badge-compact data-quality-badge-compact--${getScoreLevel(score)}`}
        aria-label={`Calidad de datos: ${score}% (${getScoreLabel(score)})`}
      >
        <span className="badge-context">Calidad:</span>
        <span className="badge-score">{score}%</span>
        <span className="badge-separator" aria-hidden="true">
          ·
        </span>
        <span className="badge-label">{getScoreLabel(score)}</span>
      </div>
    );
  }

  return (
    <div
      className="data-quality-badge"
      style={{
        background: getScoreColor(score),
        color: "white",
      }}
      title={`Calidad de datos: ${score}% (${getScoreLabel(score)})`}
    >
      <div className="badge-content">
        <span className="badge-context">Calidad:</span>
        <span className="badge-score">{score}%</span>
        <span className="badge-label">{getScoreLabel(score)}</span>
      </div>
    </div>
  );
};

export default DataQualityBadge;
