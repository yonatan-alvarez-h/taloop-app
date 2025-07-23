import React from "react";
import type { Dataset } from "../../../../types/dataset";
import DatasetRating from "../../Rating";
import "./DetailsHeader.css";

interface DetailsHeaderProps {
  dataset: Dataset;
}

const DetailsHeader: React.FC<DetailsHeaderProps> = ({ dataset }) => {
  return (
    <div className="details-header">
      <div className="details-header-title-row">
        <div className="details-header-title">{dataset.title}</div>
        <span className="details-header-price">
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
  );
};

export default DetailsHeader;
