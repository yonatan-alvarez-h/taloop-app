import React from "react";
import type { DataQuality as DataQualityType } from "../../../types/dataset";
import RadarChart from "./RadarChart";
import "./DataQuality.css";

interface DataQualityProps {
  dataQuality: DataQualityType;
}

const DataQuality: React.FC<DataQualityProps> = ({ dataQuality }) => {
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
      {/* Gráfico Radar para visualización de métricas */}
      <div className="quality-visual-section">
        <RadarChart metrics={qualityMetrics} />
      </div>

      <div className="quality-metadata">
        <div className="quality-info-grid">
          <div className="quality-info-item">
            <span className="quality-info-label">Última validación:</span>
            <span className="quality-info-value">
              {formatDate(dataQuality.lastValidated)}
            </span>
          </div>
          <div className="quality-info-item">
            <span className="quality-info-label">Método de validación:</span>
            <span className="quality-info-value quality-method">
              {dataQuality.validationMethod === "automated" ? (
                <>
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
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                  Automatizado
                </>
              ) : dataQuality.validationMethod === "manual" ? (
                <>
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <path d="M9 13l2 2 4-4"></path>
                  </svg>
                  Manual
                </>
              ) : (
                <>
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
                    <polyline points="8 18 12 12 8 6"></polyline>
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                    <circle cx="12" cy="12" r="1"></circle>
                    <path d="M16 8h4"></path>
                    <path d="M18 6v4"></path>
                    <path d="M16 16l2 2 4-4"></path>
                  </svg>
                  Híbrido
                </>
              )}
            </span>
          </div>
        </div>

        {dataQuality.recommendedFor &&
          dataQuality.recommendedFor.length > 0 && (
            <div className="quality-recommendations">
              <div className="quality-recommendations-grid">
                <div className="quality-rec-section quality-rec-section--recommended">
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
                    <div className="quality-rec-section quality-rec-section--not-recommended">
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
            </div>
          )}

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
      </div>
    </div>
  );
};

export default DataQuality;
