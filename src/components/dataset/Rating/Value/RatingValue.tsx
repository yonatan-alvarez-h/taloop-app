import React from "react";
import "./RatingValue.css";

interface RatingValueProps {
  rating: number;
  precision?: number;
  size?: "small" | "medium" | "large";
  variant?: "default" | "compact" | "detailed";
}

const RatingValue: React.FC<RatingValueProps> = ({
  rating,
  precision = 2,
  size = "medium",
  variant = "default",
}) => {
  const formatRating = (value: number) => {
    return value.toFixed(precision);
  };

  const getVariantClass = () => {
    switch (variant) {
      case "compact":
        return "rating-value--compact";
      case "detailed":
        return "rating-value--detailed";
      default:
        return "rating-value--default";
    }
  };

  return (
    <span className={`rating-value rating-value--${size} ${getVariantClass()}`}>
      {formatRating(rating)}
      {variant === "detailed" && (
        <span className="rating-value__scale">/5</span>
      )}
    </span>
  );
};

export default RatingValue;
