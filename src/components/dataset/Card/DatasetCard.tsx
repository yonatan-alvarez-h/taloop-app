import React from "react";
import DatasetRating from "../Rating/DatasetRating";
import DataQualityBadge from "../Quality/DataQualityBadge";
import type { Dataset } from "../../../types/dataset";
import DatasetOwner from "../Owner/DatasetOwner";
import DatasetTags from "../Tags/DatasetTags";
import categoryColors from "../../../data/categoryColors";
import "./DatasetCard.css";

interface DatasetCardProps {
  dataset: Dataset & { category?: string; rating?: number };
}

const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const handleTooltipShow = (e: React.MouseEvent) => {
    const tooltip = e.currentTarget.nextSibling as HTMLElement;
    if (tooltip) {
      tooltip.className =
        "dataset-card__tooltip dataset-card__tooltip--visible dataset-card__tooltip--responsive";
    }
  };

  const handleTooltipHide = (e: React.MouseEvent) => {
    const tooltip = e.currentTarget.nextSibling as HTMLElement;
    if (tooltip) {
      tooltip.className =
        "dataset-card__tooltip dataset-card__tooltip--responsive";
    }
  };

  return (
    <li className="dataset-card">
      {/* Header: Title and Price */}
      <div className="dataset-card__header">
        <div className="dataset-card__title">{dataset.title}</div>
        <span className="dataset-card__price">
          {dataset.priceUsd.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      </div>

      {/* Rating and Data Quality */}
      <div className="dataset-card__rating-quality">
        {typeof dataset.rating === "number" && (
          <DatasetRating
            rating={dataset.rating}
            ratingCount={dataset.ratingCount}
          />
        )}

        {dataset.dataQuality && (
          <div className="dataset-card__quality">
            <DataQualityBadge
              score={dataset.dataQuality.overallScore}
              compact
            />
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="dataset-card__tags">
        <div className="dataset-card__tags-container">
          <DatasetTags
            tags={dataset.tags.slice(0, 5)}
            style={{
              gap: 4,
              flexWrap: "wrap",
              minWidth: 0,
              overflow: "hidden",
            }}
          />
          {dataset.tags.length > 5 && (
            <span className="dataset-card__tags-more">
              +{dataset.tags.length - 5} más
            </span>
          )}
        </div>
      </div>

      {/* Description with Tooltip */}
      <div className="dataset-card__description">
        <div className="dataset-card__description-wrapper">
          <span
            className={`dataset-card__description-text ${
              dataset.description.length > 150
                ? "dataset-card__description-text--clickable"
                : ""
            }`}
            onMouseEnter={
              dataset.description.length > 150 ? handleTooltipShow : undefined
            }
            onMouseLeave={
              dataset.description.length > 150 ? handleTooltipHide : undefined
            }
          >
            {dataset.description.length > 150
              ? dataset.description.slice(0, 149) + "..."
              : dataset.description}
          </span>
          {dataset.description.length > 150 && (
            <span className="dataset-card__tooltip dataset-card__tooltip--responsive">
              {dataset.description}
            </span>
          )}
        </div>
      </div>

      {/* Category and Owner */}
      <div className="dataset-card__meta">
        {/* Category */}
        {dataset.category && (
          <div
            className="dataset-card__category"
            style={{
              background:
                categoryColors[dataset.category.toLowerCase()] || "#6366f1",
              boxShadow: `0 1px 6px ${
                categoryColors[dataset.category.toLowerCase()] || "#6366f1"
              }22`,
            }}
          >
            {dataset.category}
          </div>
        )}
        {/* Owner */}
        <div className="dataset-card__owner-wrapper ms-3">
          <DatasetOwner owner={dataset.owner} />
        </div>
      </div>

      {/* Actions */}
      <div className="dataset-card__actions">
        <button
          className="btn btn-outline-primary btn-sm dataset-card__btn"
          onClick={() => window.open(`/datasets/${dataset.uid}`, "_self")}
        >
          Ver detalles
        </button>
      </div>
    </li>
  );
};

export default DatasetCard;
