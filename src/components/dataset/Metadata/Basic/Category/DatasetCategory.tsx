import React from "react";
import categoryColors from "../../../../../data/categoryColors";
import "./DatasetCategory.css";

interface DatasetCategoryProps {
  category: string;
  variant?: "default" | "soft";
}

const DatasetCategory: React.FC<DatasetCategoryProps> = ({
  category,
  variant = "default",
}) => {
  const color = categoryColors[category.toLowerCase()] || "#6366f1";

  return (
    <span
      className={`dataset-category dataset-category--${variant}`}
      style={{ "--dataset-category-color": color } as React.CSSProperties}
    >
      {category}
    </span>
  );
};

export default DatasetCategory;
