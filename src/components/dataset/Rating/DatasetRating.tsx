import React from "react";
import StarDisplay from "./Display";
import RatingValue from "./Value";
import RatingCount from "./Count";
import "./DatasetRating.css";

interface DatasetRatingProps {
  rating: number; // promedio entre 1 y 5
  ratingCount?: number; // cantidad de calificaciones
  size?: "small" | "medium" | "large";
  variant?: "default" | "compact" | "detailed";
  showStars?: boolean;
  showValue?: boolean;
  showCount?: boolean;
}

const DatasetRating: React.FC<DatasetRatingProps> = ({
  rating,
  ratingCount,
  size = "medium",
  variant = "default",
  showStars = true,
  showValue = true,
  showCount = true,
}) => {
  return (
    <div
      className={`dataset-rating dataset-rating--${size} dataset-rating--${variant}`}
    >
      {showStars && (
        <StarDisplay
          rating={rating}
          size={size}
          showHalf={variant === "detailed"}
        />
      )}

      {showValue && (
        <RatingValue
          rating={rating}
          size={size}
          variant={variant}
          precision={variant === "compact" ? 1 : 2}
        />
      )}

      {showCount && typeof ratingCount === "number" && (
        <RatingCount count={ratingCount} size={size} variant={variant} />
      )}
    </div>
  );
};

export default DatasetRating;
