import React from "react";
import type { Dataset } from "../../../../types/dataset";
import DatasetPreview from "../../Preview";
import SectionTitle from "../Section/SectionTitle";
import "./DetailsPreview.css";

interface DetailsPreviewProps {
  dataset: Dataset;
}

const DetailsPreview: React.FC<DetailsPreviewProps> = ({ dataset }) => {
  return (
    <div className="details-preview-section">
      <SectionTitle>Vista Previa de los Datos</SectionTitle>
      <DatasetPreview dataset={dataset} />
    </div>
  );
};

export default DetailsPreview;
