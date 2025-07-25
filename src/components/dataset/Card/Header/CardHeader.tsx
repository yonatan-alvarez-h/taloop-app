import React from "react";
import DatasetPrice from "../../Price";
import "./CardHeader.css";

interface CardHeaderProps {
  title: string;
  price: number;
  currency?: string;
  variant?: "default" | "compact" | "detailed";
  onClick?: () => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  price,
  currency = "USD",
  variant = "default",
  onClick,
}) => {
  return (
    <div
      className={`card-header card-header--${variant} ${
        onClick ? "card-header--clickable" : ""
      }`}
      onClick={onClick}
    >
      <div className="card-header__title-container">
        <h4 className="card-header__title" title={title}>
          {title}
        </h4>
      </div>

      <div className="card-header__price-container">
        <DatasetPrice price={price} currency={currency} />
      </div>
    </div>
  );
};

export default CardHeader;
