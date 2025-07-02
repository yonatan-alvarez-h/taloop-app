import React, { useState } from "react";
import type { Dataset } from "../../types/dataset";
import "./DatasetPreview.css";

interface DatasetPreviewProps {
  dataset: Dataset;
}

const DatasetPreview: React.FC<DatasetPreviewProps> = ({ dataset }) => {
  const [show, setShow] = useState(false);

  // Usar los samples reales si existen, si no mostrar vacío
  // Permitimos samples en datasets extendidos
  const previewData: Record<string, unknown>[] =
    typeof (dataset as any).samples !== "undefined" &&
    Array.isArray((dataset as any).samples)
      ? (dataset as any).samples.slice(0, 5)
      : [];

  return (
    <div style={{ marginTop: "1em" }}>
      <button
        className="dataset-preview-btn"
        onClick={() => setShow((v) => !v)}
      >
        {show ? "Ocultar vista previa" : "Ver vista previa"}
      </button>
      {show && (
        <div className="dataset-preview-card">
          <div className="dataset-preview-meta">
            <strong>Metadata:</strong>
            <ul>
              <li>
                <b>ID:</b> {dataset.id}
              </li>
              <li>
                <b>Título:</b> {dataset.title}
              </li>
              <li style={{alignItems: 'flex-start'}}>
                <b>Etiquetas:</b>
                <span>
                  {dataset.tags.map((tag) => (
                    <span className="dataset-tags-chip" key={tag}>{tag}</span>
                  ))}
                </span>
              </li>
              <li style={{alignItems: 'flex-start'}}>
                <b>Campos:</b>
                <span>
                  {dataset.fields.map((field) => (
                    <span className="dataset-fields-chip" key={field}>{field}</span>
                  ))}
                </span>
              </li>
              <li>
                <b>Descripción:</b> {dataset.description}
              </li>
              <li>
                <b>Propietario:</b> {dataset.owner.name}
              </li>
              <li>
                <b>Precio:</b> {dataset.priceUsd} USD
              </li>
            </ul>
          </div>
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
                          {dataset.fields.map((field) => (
                            <td key={field}>
                              {row[field] !== undefined && row[field] !== null
                                ? String(row[field])
                                : "-"}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                <div
                  style={{ color: "#888", fontStyle: "italic", marginTop: 8 }}
                >
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
