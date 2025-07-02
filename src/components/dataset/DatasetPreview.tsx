import React, { useState } from "react";
import type { Dataset } from "../../types/dataset";
import "./DatasetPreview.css";

interface DatasetPreviewProps {
  dataset: Dataset;
}

const mockPreviewData = [
  { fecha: "2024-01-01", producto: "A", cantidad: 10, total: 100 },
  { fecha: "2024-01-02", producto: "B", cantidad: 5, total: 50 },
  { fecha: "2024-01-03", producto: "C", cantidad: 8, total: 80 },
];

const DatasetPreview: React.FC<DatasetPreviewProps> = ({ dataset }) => {
  const [show, setShow] = useState(false);

  // Simulación: en un caso real, los datos vendrían de una API
  const previewData = mockPreviewData;

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
              <li>
                <b>Etiquetas:</b> {dataset.tags.join(", ")}
              </li>
              <li>
                <b>Campos:</b> {dataset.fields.join(", ")}
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
              <table className="table table-sm table-bordered mt-2 mb-0">
                <thead>
                  <tr>
                    {dataset.fields.map((field) => (
                      <th key={field}>{field}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      {dataset.fields.map((field) => (
                        <td key={field}>
                          {(row as Record<string, any>)[field] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetPreview;
