import React from "react";
import "./DatasetPrice.css";

interface DatasetPriceProps {
  /** Price amount to display */
  price: number;
  /** Currency code (default: "USD") */
  currency?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * DatasetPrice component for consistent price display across the application.
 *
 * @example
 * <DatasetPrice price={29.99} />
 * <DatasetPrice price={29.99} currency="EUR" />
 */
const DatasetPrice: React.FC<DatasetPriceProps> = ({
  price,
  currency = "USD",
  className = "",
}) => {
  const formatPrice = (amount: number, curr: string) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: curr,
    });
  };

  return (
    <span className={`dataset-price ${className}`}>
      {formatPrice(price, currency)}
    </span>
  );
};

export default DatasetPrice;
