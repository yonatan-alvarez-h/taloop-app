import React, { useState } from "react";
import type {
  Dataset,
  DatasetWithSamples,
  DataSample,
} from "../../../../types/dataset";
import "./DatasetPreview.css";

interface DatasetPreviewProps {
  dataset: Dataset;
}

const DatasetPreview: React.FC<DatasetPreviewProps> = ({ dataset }) => {
  const [show, setShow] = useState(false);

  // Usar los samples reales si existen, si no mostrar vacío
  // Permitimos samples en datasets extendidos
  const datasetWithSamples = dataset as DatasetWithSamples;
  const previewData: DataSample[] =
    datasetWithSamples.samples && Array.isArray(datasetWithSamples.samples)
      ? datasetWithSamples.samples.slice(0, 5)
      : [];

  // Helper para determinar si un valor es numérico
  const isNumeric = (value: unknown) => {
    return (
      typeof value === "number" ||
      (!isNaN(Number(value)) &&
        value !== null &&
        value !== "" &&
        typeof value !== "boolean")
    );
  };

  return (
    <div className="dataset-preview">
      <button
        className="dataset-preview-btn"
        onClick={() => setShow((v) => !v)}
      >
        {show ? "Ocultar vista previa" : "Ver vista previa"}
      </button>
      {show && (
        <div className="dataset-preview-card">
          <div>
            <strong>Datos de ejemplo:</strong>
            <div className="dataset-preview-table">
              {previewData.length > 0 ? (
                <table className="table table-sm table-bordered mt-2 mb-0">
                  <thead>
                    <tr>
                      {dataset.fields.map((field) => (
                        <th key={field}>{field}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map(
                      (row: Record<string, unknown>, i: number) => (
                        <tr key={i}>
                          {dataset.fields.map((field) => {
                            const value = row[field];
                            const alignClass = isNumeric(value)
                              ? "align-right"
                              : "align-left";
                            return (
                              <td key={field} className={alignClass}>
                                {value !== undefined && value !== null
                                  ? String(value)
                                  : "-"}
                              </td>
                            );
                          })}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="dataset-preview-empty">
                  No hay datos de ejemplo disponibles para este dataset.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetPreview;
