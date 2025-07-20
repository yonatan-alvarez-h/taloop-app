import React from "react";
import categoryColors from "../../../data/categoryColors";
import "./DatasetCategory.css";

interface DatasetCategoryProps {
  category: string;
  variant?: "card" | "details";
}

const DatasetCategory: React.FC<DatasetCategoryProps> = ({
  category,
  variant = "card",
}) => {
  const color = categoryColors[category.toLowerCase()] || "#6366f1";

  return (
    <div
      className={`dataset-category dataset-category--${variant}`}
      style={{
        background: color,
        boxShadow: `0 1px 6px ${color}22`,
      }}
    >
      {category}
    </div>
  );
};

export default DatasetCategory;
