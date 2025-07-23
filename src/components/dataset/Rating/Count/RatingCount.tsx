import React from "react";
import "./RatingCount.css";

interface RatingCountProps {
  count: number;
  size?: "small" | "medium" | "large";
  variant?: "default" | "compact" | "detailed";
  label?: string;
}

const RatingCount: React.FC<RatingCountProps> = ({
  count,
  size = "medium",
  variant = "default",
  label,
}) => {
  const formatCount = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const getDisplayText = () => {
    const formattedCount = formatCount(count);

    switch (variant) {
      case "compact":
        return `(${formattedCount})`;
      case "detailed":
        return `${formattedCount} ${
          label || (count === 1 ? "valoración" : "valoraciones")
        }`;
      default:
        return `(${formattedCount} ${
          count === 1 ? "valoración" : "valoraciones"
        })`;
    }
  };

  return (
    <span
      className={`rating-count rating-count--${size} rating-count--${variant}`}
    >
      {getDisplayText()}
    </span>
  );
};

export default RatingCount;
