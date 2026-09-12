import React from "react";
import CardHeader from "./Header";
import CardContent from "./Content";
import CardActions from "./Actions";
import FavoriteButton from "../../Favorites/FavoriteButton";
import DatasetPrice from "../Price";
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
      window.open(`/datasets/${encodeURIComponent(dataset._id)}`, "_self");
    }
  };

  const actions = [
    {
      label: "Ver dataset",
      onClick: handleDetailsClick,
      variant: "primary" as const,
    },
  ];

  return (
    <li
      className={`dataset-card dataset-card--${variant} ${
        clickable ? "dataset-card--clickable" : ""
      }`}
    >
      <div className="dataset-card__main">
        <CardHeader
          title={dataset.title}
          variant={variant}
          category={showCategory ? dataset.category : undefined}
          owner={showOwner ? dataset.owner : undefined}
          ownerId={dataset.owner_id}
          datasetId={dataset._id || undefined}
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
      </div>

      <div
        className="dataset-card__rail"
        role="group"
        aria-label={`Acciones para ${dataset.title}`}
      >
        <div className="dataset-card__price-row">
          <DatasetPrice
            price={dataset.priceUsd}
            currency="USD"
            showCurrencyCode
          />
          <FavoriteButton datasetId={dataset._id} datasetTitle={dataset.title} />
        </div>
        <CardActions
          actions={actions}
          variant={variant}
          size={variant === "compact" ? "small" : "medium"}
        />
      </div>
    </li>
  );
};

export default DatasetCard;
