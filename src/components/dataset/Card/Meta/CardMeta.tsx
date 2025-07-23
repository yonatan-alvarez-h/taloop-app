import React from "react";
import { DatasetCategory, DatasetOwner } from "../../Metadata/Basic";
import type { Dataset } from "../../../../types/dataset";
import "./CardMeta.css";

interface CardMetaProps {
  dataset: Dataset & { category?: string };
  showCategory?: boolean;
  showOwner?: boolean;
  layout?: "horizontal" | "vertical" | "stacked";
  variant?: "default" | "compact" | "detailed";
}

const CardMeta: React.FC<CardMetaProps> = ({
  dataset,
  showCategory = true,
  showOwner = true,
  layout = "horizontal",
  variant = "default",
}) => {
  const hasVisibleMeta =
    (showCategory && dataset.category) || (showOwner && dataset.owner);

  if (!hasVisibleMeta) {
    return null;
  }

  return (
    <div className={`card-meta card-meta--${layout} card-meta--${variant}`}>
      <div className="card-meta__row">
        {showCategory && dataset.category && (
          <div className="card-meta__category">
            <DatasetCategory category={dataset.category} />
          </div>
        )}

        {showOwner && dataset.owner && (
          <div className="card-meta__owner">
            <DatasetOwner owner={dataset.owner} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardMeta;
