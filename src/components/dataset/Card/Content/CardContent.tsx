import React from "react";
import DatasetRating from "../../Rating";
import DataQualityBadge from "../../Quality/Badge";
import DatasetTags from "../../Tags";
import type { Dataset } from "../../../../types/dataset";
import "./CardContent.css";

interface CardContentProps {
  dataset: Dataset & { category?: string; rating?: number };
  showRating?: boolean;
  showQuality?: boolean;
  showTags?: boolean;
  showDescription?: boolean;
  maxDescriptionLength?: number;
  maxVisibleTags?: number;
  variant?: "default" | "compact" | "detailed";
}

const CardContent: React.FC<CardContentProps> = ({
  dataset,
  showRating = true,
  showQuality = true,
  showTags = true,
  showDescription = true,
  maxDescriptionLength = 150,
  maxVisibleTags = 5,
  variant = "default",
}) => {
  // Calcular el promedio de las métricas de calidad de datos
  const calculateQualityAverage = (
    dataQuality: NonNullable<Dataset["dataQuality"]>
  ) => {
    const metrics = [
      dataQuality.completeness,
      dataQuality.accuracy,
      dataQuality.consistency,
      dataQuality.validity,
      dataQuality.timeliness,
      dataQuality.uniqueness,
    ];
    const average =
      metrics.reduce((sum, value) => sum + value, 0) / metrics.length;
    return Math.round(average);
  };
  const handleTooltipShow = (e: React.MouseEvent) => {
    const tooltip = e.currentTarget.nextSibling as HTMLElement;
    if (tooltip) {
      tooltip.className =
        "card-content__tooltip card-content__tooltip--visible";
    }
  };

  const handleTooltipHide = (e: React.MouseEvent) => {
    const tooltip = e.currentTarget.nextSibling as HTMLElement;
    if (tooltip) {
      tooltip.className = "card-content__tooltip";
    }
  };

  const shouldShowTooltip = dataset.description.length > maxDescriptionLength;
  const truncatedDescription = shouldShowTooltip
    ? dataset.description.slice(0, maxDescriptionLength - 1) + "..."
    : dataset.description;

  return (
    <div className={`card-content card-content--${variant}`}>
      {/* Quality and Rating Section */}
      {(showQuality || showRating) && (
        <div className="card-content__metrics">
          {showQuality && dataset.dataQuality && (
            <div className="card-content__quality">
              <DataQualityBadge
                score={calculateQualityAverage(dataset.dataQuality)}
                compact={variant === "compact"}
              />
            </div>
          )}

          {showRating && typeof dataset.rating === "number" && (
            <div className="card-content__rating">
              <DatasetRating
                rating={dataset.rating}
                ratingCount={dataset.ratingCount}
                size={variant === "compact" ? "small" : "medium"}
                variant={variant}
              />
            </div>
          )}
        </div>
      )}

      {/* Tags Section */}
      {showTags && dataset.tags.length > 0 && (
        <div className="card-content__tags">
          <DatasetTags
            tags={dataset.tags}
            maxVisible={maxVisibleTags}
            size={variant === "compact" ? "small" : "medium"}
            variant="default"
            gap={variant === "compact" ? 4 : 6}
            expandable={variant === "detailed"}
          />
        </div>
      )}

      {/* Description Section */}
      {showDescription && dataset.description && (
        <div className="card-content__description">
          <div className="card-content__description-wrapper">
            <span
              className={`card-content__description-text ${
                shouldShowTooltip
                  ? "card-content__description-text--clickable"
                  : ""
              }`}
              onMouseEnter={shouldShowTooltip ? handleTooltipShow : undefined}
              onMouseLeave={shouldShowTooltip ? handleTooltipHide : undefined}
            >
              {truncatedDescription}
            </span>
            {shouldShowTooltip && (
              <span className="card-content__tooltip">
                {dataset.description}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContent;
