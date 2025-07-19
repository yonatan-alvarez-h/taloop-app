import React from "react";
import type { DataQuality as DataQualityType } from "../../../types/dataset";
import SpiderChart from "./SpiderChart";
import "./DataQuality.css";

interface DataQualityProps {
  dataQuality: DataQualityType;
}

const DataQuality: React.FC<DataQualityProps> = ({ dataQuality }) => {
  const getOverallScoreColor = (score: number) => {
    if (score >= 8.5) return "#22c55e"; // Verde - Excelente
    if (score >= 7.0) return "#84cc16"; // Verde claro - Muy bueno
    if (score >= 6.0) return "#eab308"; // Amarillo - Bueno
    if (score >= 4.0) return "#f97316"; // Naranja - Regular
    return "#ef4444"; // Rojo - Bajo
  };

  const getOverallScoreLabel = (score: number) => {
    if (score >= 8.5) return "Excelente";
    if (score >= 7.0) return "Muy bueno";
    if (score >= 6.0) return "Bueno";
    if (score >= 4.0) return "Regular";
    return "Bajo";
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("es-ES");
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("es-ES");
  };

  const qualityMetrics = [
    {
      key: "completeness",
      label: "Completitud",
      value: dataQuality.completeness,
      description: "Porcentaje de campos sin valores nulos",
    },
    {
      key: "accuracy",
      label: "Precisión",
      value: dataQuality.accuracy,
      description: "Nivel de exactitud de los datos",
    },
    {
      key: "consistency",
      label: "Consistencia",
      value: dataQuality.consistency,
      description: "Uniformidad en formatos y valores",
    },
    {
      key: "validity",
      label: "Validez",
      value: dataQuality.validity,
      description: "Cumplimiento de reglas de negocio",
    },
    {
      key: "timeliness",
      label: "Actualización",
      value: dataQuality.timeliness,
      description: "Qué tan actualizados están los datos",
    },
    {
      key: "uniqueness",
      label: "Unicidad",
      value: dataQuality.uniqueness,
      description: "Porcentaje de registros únicos sin duplicados",
    },
  ];

  return (
    <div className="data-quality-container">
      <div className="data-quality-header">
        <h3>📊 Calidad de Datos</h3>
        <div className="overall-score">
          <span className="overall-score-label">Puntuación General</span>
          <div
            className="overall-score-badge"
            style={{
              backgroundColor: getOverallScoreColor(dataQuality.overallScore),
              color: "white",
            }}
          >
            {dataQuality.overallScore}/10
            <span className="overall-score-text">
              {getOverallScoreLabel(dataQuality.overallScore)}
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico Spider para visualización de métricas */}
      <div className="quality-visual-section">
        <SpiderChart metrics={qualityMetrics} size={260} />
      </div>

      <div className="quality-metadata">
        <div className="quality-info-grid">
          <div className="quality-info-item">
            <span className="quality-info-label">Registros totales:</span>
            <span className="quality-info-value">
              {formatNumber(dataQuality.totalRecords)}
            </span>
          </div>
          <div className="quality-info-item">
            <span className="quality-info-label">Última validación:</span>
            <span className="quality-info-value">
              {formatDate(dataQuality.lastValidated)}
            </span>
          </div>
          <div className="quality-info-item">
            <span className="quality-info-label">Método de validación:</span>
            <span className="quality-info-value quality-method">
              {dataQuality.validationMethod === "automated"
                ? "🤖 Automatizado"
                : dataQuality.validationMethod === "manual"
                ? "👤 Manual"
                : "🔄 Híbrido"}
            </span>
          </div>
        </div>

        {dataQuality.knownIssues && dataQuality.knownIssues.length > 0 && (
          <div className="quality-issues">
            <h4>⚠️ Problemas conocidos:</h4>
            <ul>
              {dataQuality.knownIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {dataQuality.recommendedFor &&
          dataQuality.recommendedFor.length > 0 && (
            <div className="quality-recommendations">
              <div className="quality-rec-section">
                <h4>✅ Recomendado para:</h4>
                <ul>
                  {dataQuality.recommendedFor.map((use, index) => (
                    <li key={index} className="recommended">
                      {use}
                    </li>
                  ))}
                </ul>
              </div>

              {dataQuality.notRecommendedFor &&
                dataQuality.notRecommendedFor.length > 0 && (
                  <div className="quality-rec-section">
                    <h4>❌ No recomendado para:</h4>
                    <ul>
                      {dataQuality.notRecommendedFor.map((use, index) => (
                        <li key={index} className="not-recommended">
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
      </div>
    </div>
  );
};

export default DataQuality;
