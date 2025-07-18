import React from "react";
import "./DatasetRating.css";

interface DatasetRatingProps {
  rating: number; // promedio entre 1 y 5
}

const DatasetRating: React.FC<DatasetRatingProps> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="dataset-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={star <= Math.round(rating) ? "star filled" : "star"}
          aria-label={
            star <= Math.round(rating) ? "Estrella llena" : "Estrella vacía"
          }
        >
          ★
        </span>
      ))}
      <span className="dataset-rating-value">{rating.toFixed(2)}</span>
    </div>
  );
};

export default DatasetRating;
