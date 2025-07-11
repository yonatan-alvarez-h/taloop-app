import React from "react";
import type { Dataset } from "../../../types/dataset";
import categoryColors from "../../../data/categoryColors";
import DatasetOwner from "../Owner/DatasetOwner";
import DatasetFields from "../Fields/DatasetFields";
import DatasetTags from "../Tags/DatasetTags";
import DatasetPreview from "./Preview/DatasetPreview";
import DatasetMetadata from "./Metadata/DatasetMetadata";

import "./DatasetDetails.css";

interface DatasetDetailsProps {
  dataset: Dataset;
}

const DatasetDetails: React.FC<DatasetDetailsProps> = ({ dataset }) => {
  return (
    <div className="dataset-details-container">
      <div className="dataset-details-title-row">
        <div className="dataset-details-title">{dataset.title}</div>
        <span className="dataset-details-price">
          {dataset.priceUsd.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      </div>
      {dataset.category &&
        (() => {
          const color =
            categoryColors[dataset.category.toLowerCase()] || "#6366f1";
          return (
            <div
              className="dataset-details-category"
              style={{ background: color, boxShadow: `0 1px 6px ${color}22` }}
            >
              {dataset.category}
            </div>
          );
        })()}

      {/* Metadata separada */}
      <DatasetMetadata dataset={dataset} />

      {/* Campos */}
      <div className="dataset-details-section">
        <span className="fw-bold">Campos:</span>{" "}
        <DatasetFields fields={dataset.fields} />
      </div>

      {/* Vista previa */}
      <div
        className="dataset-details-section"
        style={{ borderBottom: "none", marginBottom: 0 }}
      >
        <h6 className="dataset-details-section-title mb-2">Vista previa</h6>
        <DatasetPreview dataset={dataset} />
      </div>
    </div>
  );
};

export default DatasetDetails;
