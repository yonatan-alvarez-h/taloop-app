import React from "react";
import type { Dataset } from "../../../../types/dataset";
import DatasetRating from "../../Rating";
import DatasetPrice from "../../Price";
import "./DetailsHeader.css";

interface DetailsHeaderProps {
  dataset: Dataset;
}

const DetailsHeader: React.FC<DetailsHeaderProps> = ({ dataset }) => {
  return (
    <div className="details-header">
      <div className="details-header-title-row">
        <div className="details-header-title">{dataset.title}</div>
        <DatasetPrice price={dataset.priceUsd} currency="USD" />
      </div>

      <div className="details-header-description">
        <p>{dataset.description}</p>
      </div>

      {typeof dataset.rating === "number" && (
        <DatasetRating
          rating={dataset.rating}
          ratingCount={dataset.ratingCount}
        />
      )}
    </div>
  );
};

export default DetailsHeader;
