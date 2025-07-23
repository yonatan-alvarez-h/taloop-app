import React, { useState } from "react";
import type {
  Dataset,
  DatasetWithSamples,
  DataSample,
} from "../../../types/dataset";
import PreviewControls from "./Controls/PreviewControls";
import PreviewTable from "./Table/PreviewTable";
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

  const handleToggle = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className="dataset-preview">
      <PreviewControls show={show} onToggle={handleToggle} />
      {show && (
        <div className="dataset-preview-card">
          <div>
            <strong>Datos de ejemplo:</strong>
            <PreviewTable fields={dataset.fields} data={previewData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetPreview;
