import React from "react";
import type { Dataset } from "../../../types/dataset";
import DatasetRating from "../Rating/DatasetRating";
import DatasetPreview from "./Preview/DatasetPreview";
import DatasetMetadata from "./Metadata/DatasetMetadata";
import DataQuality from "../Quality/DataQuality";

import "./DatasetDetails.css";

interface DatasetDetailsProps {
  dataset: Dataset;
}

const DatasetDetails: React.FC<DatasetDetailsProps> = ({ dataset }) => {
  return (
    <div className="dataset-details-container">
      {/* Header section with title, price and rating */}
      <div className="dataset-details-header">
        <div className="dataset-details-title-row">
          <div className="dataset-details-title">{dataset.title}</div>
          <span className="dataset-details-price">
            {dataset.priceUsd.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>

        {typeof dataset.rating === "number" && (
          <DatasetRating
            rating={dataset.rating}
            ratingCount={dataset.ratingCount}
          />
        )}
      </div>

      {/* Dashboard layout: Metadata left, Data Quality right */}
      <div className="dataset-details-dashboard">
        <div className="dataset-details-dashboard-left">
          <div className="dataset-details-dashboard-section-title">
            <h3>Información del Dataset</h3>
          </div>
          <DatasetMetadata dataset={dataset} />
        </div>

        <div className="dataset-details-dashboard-right">
          <div className="dataset-details-dashboard-section-title">
            <h3>Calidad de Datos</h3>
          </div>
          {dataset.dataQuality ? (
            <DataQuality dataQuality={dataset.dataQuality} />
          ) : (
            <div className="dataset-details-no-data-quality">
              <p>
                Información de calidad de datos no disponible para este dataset.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview section at bottom */}
      <div className="dataset-details-preview-section">
        <div className="dataset-details-dashboard-section-title">
          <h3>Vista Previa de los Datos</h3>
        </div>
        <DatasetPreview dataset={dataset} />
      </div>
    </div>
  );
};

export default DatasetDetails;
