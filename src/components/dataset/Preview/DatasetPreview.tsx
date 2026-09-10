import React from "react";
import { Link } from "react-router-dom";
import type {
  Dataset,
  DatasetWithSamples,
  DataSample,
} from "../../../types/dataset";
import PreviewTable from "./Table/PreviewTable";
import { useAuth } from "../../../context/useAuth";
import "./DatasetPreview.css";

// Constante configurable para el número de registros a mostrar en la vista previa
const PREVIEW_RECORDS_LIMIT = 5;

interface DatasetPreviewProps {
  dataset: Dataset;
}

const DatasetPreview: React.FC<DatasetPreviewProps> = ({ dataset }) => {
  const { isAuthenticated } = useAuth();
  // Usar los samples reales si existen, si no mostrar vacío
  // Permitimos samples en datasets extendidos
  const datasetWithSamples = dataset as DatasetWithSamples;
  const previewData: DataSample[] =
    datasetWithSamples.samples && Array.isArray(datasetWithSamples.samples)
      ? datasetWithSamples.samples.slice(0, PREVIEW_RECORDS_LIMIT)
      : [];

  const publicPreviewAvailable =
    dataset.status === "active" &&
    (dataset.visibility === "public" || dataset.visibility === "unlisted") &&
    dataset.publicPreviewEnabled;

  if (!isAuthenticated) {
    return (
      <div className="dataset-preview-empty">
        {publicPreviewAvailable ? (
          <>
            Inicia sesión para consultar la vista previa limitada.
            <Link to="/login"> Iniciar sesión</Link>
          </>
        ) : (
          "La vista previa no está disponible para visitantes."
        )}
      </div>
    );
  }

  if (dataset.previewAvailable === false) {
    return (
      <div className="dataset-preview-empty">
        La vista previa no está disponible para tu cuenta o para este estado del dataset.
      </div>
    );
  }

  return (
    <div className="dataset-preview">
      <div className="dataset-preview-card">
        <div className="preview-header">
          <div>
            <h3 className="preview-title">Datos de ejemplo</h3>
            <p className="preview-description">
              {dataset.isLimited === false
                ? `Muestra de hasta ${PREVIEW_RECORDS_LIMIT} registros`
                : `Vista previa limitada de hasta ${PREVIEW_RECORDS_LIMIT} registros`}
            </p>
          </div>
        </div>
        <PreviewTable fields={dataset.fields} data={previewData} />
      </div>
    </div>
  );
};

export default DatasetPreview;
