import React from "react";
import DatasetPrice from "../../Price";
import "./CardHeader.css";

interface CardHeaderProps {
  title: string;
  price: number;
  currency?: string;
  variant?: "default" | "compact" | "detailed";
  onClick?: () => void;
  action?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  price,
  currency = "USD",
  variant = "default",
  onClick,
  action,
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

      <div className="card-header__actions">
        <div className="card-header__price-container">
          <DatasetPrice price={price} currency={currency} />
        </div>
        {action}
      </div>
    </div>
  );
};

export default CardHeader;
