import React from "react";
import "./StarDisplay.css";

interface StarDisplayProps {
  rating: number;
  maxStars?: number;
  size?: "small" | "medium" | "large";
  showHalf?: boolean;
}

const StarDisplay: React.FC<StarDisplayProps> = ({
  rating,
  maxStars = 5,
  size = "medium",
  showHalf = false,
}) => {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  const getStarClass = (starNumber: number) => {
    const roundedRating = showHalf ? rating : Math.round(rating);

    if (showHalf) {
      if (starNumber <= Math.floor(rating)) return "star filled";
      if (starNumber === Math.ceil(rating) && rating % 1 >= 0.5)
        return "star half-filled";
      return "star";
    }

    return starNumber <= roundedRating ? "star filled" : "star";
  };

  return (
    <div className={`star-display star-display--${size}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={getStarClass(star)}
          aria-label={
            getStarClass(star).includes("filled")
              ? "Estrella llena"
              : "Estrella vacía"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarDisplay;
