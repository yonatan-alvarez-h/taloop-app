import React, { useId, useLayoutEffect, useRef, useState } from "react";
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
  maxVisibleTags?: number;
  variant?: "default" | "compact" | "detailed";
}

const CardContent: React.FC<CardContentProps> = ({
  dataset,
  showRating = true,
  showQuality = true,
  showTags = true,
  showDescription = true,
  maxVisibleTags = 3,
  variant = "default",
}) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const descriptionId = useId();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [descriptionTruncated, setDescriptionTruncated] = useState(false);

  useLayoutEffect(() => {
    const element = descriptionRef.current;
    if (!element || descriptionExpanded) return undefined;

    const updateTruncation = () => {
      setDescriptionTruncated(element.scrollHeight > element.clientHeight + 1);
    };
    updateTruncation();
    if (typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(updateTruncation);
    observer.observe(element);
    return () => observer.disconnect();
  }, [dataset.description, descriptionExpanded, showDescription, variant]);

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
  return (
    <div className={`card-content card-content--${variant}`}>
      {showDescription && dataset.description && (
        <div className="card-content__description">
          <p
            ref={descriptionRef}
            id={descriptionId}
            className={`card-content__description-text${
              descriptionExpanded
                ? " card-content__description-text--expanded"
                : ""
            }`}
          >
            {dataset.description}
          </p>
          {descriptionTruncated && (
            <button
              type="button"
              className="card-content__description-toggle"
              aria-expanded={descriptionExpanded}
              aria-controls={descriptionId}
              onClick={() => setDescriptionExpanded((current) => !current)}
            >
              {descriptionExpanded ? "Ver menos" : "Ver descripción completa"}
            </button>
          )}
        </div>
      )}

      {(showQuality || showRating || showTags) && (
        <div className="card-content__signals">
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
        </div>
      )}
    </div>
  );
};

export default CardContent;
