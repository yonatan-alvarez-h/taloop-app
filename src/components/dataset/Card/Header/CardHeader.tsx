import React from "react";
import { Link } from "react-router-dom";
import DatasetCategory from "../../Metadata/Basic/Category/DatasetCategory";
import DatasetOwner from "../../Metadata/Basic/Owner/DatasetOwner";
import type { Dataset } from "../../../../types/dataset";
import "./CardHeader.css";

interface CardHeaderProps {
  title: string;
  variant?: "default" | "compact" | "detailed";
  onClick?: () => void;
  category?: string;
  owner?: Dataset["owner"];
  ownerId?: string;
  datasetId?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  variant = "default",
  onClick,
  category,
  owner,
  ownerId,
  datasetId,
}) => {
  return (
    <div
      className={`card-header card-header--${variant} ${
        onClick ? "card-header--clickable" : ""
      }`}
      onClick={onClick}
    >
      <div className="card-header__title-container">
        {category && <DatasetCategory category={category} variant="soft" />}
        <h3 className="card-header__title">
          {datasetId ? (
            <Link to={`/datasets/${encodeURIComponent(datasetId)}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {owner && (
          <DatasetOwner owner={owner} ownerId={ownerId} variant="compact" />
        )}
      </div>
    </div>
  );
};

export default CardHeader;
