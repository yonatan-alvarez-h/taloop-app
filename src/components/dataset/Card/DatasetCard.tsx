import React from "react";
import CardHeader from "./Header";
import CardContent from "./Content";
import CardMeta from "./Meta";
import CardActions from "./Actions";
import type { Dataset } from "../../../types/dataset";
import "./DatasetCard.css";

interface DatasetCardProps {
  dataset: Dataset & { category?: string; rating?: number };
  variant?: "default" | "compact" | "detailed";
  showRating?: boolean;
  showQuality?: boolean;
  showTags?: boolean;
  showDescription?: boolean;
  showCategory?: boolean;
  showOwner?: boolean;
  clickable?: boolean;
  onCardClick?: () => void;
  onDetailsClick?: () => void;
}

const DatasetCard: React.FC<DatasetCardProps> = ({
  dataset,
  variant = "default",
  showRating = true,
  showQuality = true,
  showTags = true,
  showDescription = true,
  showCategory = true,
  showOwner = true,
  clickable = false,
  onCardClick,
  onDetailsClick,
}) => {
  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick();
    } else {
      window.open(`/datasets/${dataset.uid}`, "_self");
    }
  };

  const actions = [
    {
      label: "Ver detalles",
      onClick: handleDetailsClick,
      variant: "outline" as const,
    },
  ];

  return (
    <li
      className={`dataset-card dataset-card--${variant} ${
        clickable ? "dataset-card--clickable" : ""
      }`}
    >
      <CardHeader
        title={dataset.title}
        price={dataset.priceUsd}
        variant={variant}
        onClick={clickable ? onCardClick : undefined}
      />

      <CardContent
        dataset={dataset}
        showRating={showRating}
        showQuality={showQuality}
        showTags={showTags}
        showDescription={showDescription}
        variant={variant}
      />

      <CardMeta
        dataset={dataset}
        showCategory={showCategory}
        showOwner={showOwner}
        variant={variant}
      />

      <CardActions
        actions={actions}
        variant={variant}
        size={variant === "compact" ? "small" : "medium"}
      />
    </li>
  );
};

export default DatasetCard;
