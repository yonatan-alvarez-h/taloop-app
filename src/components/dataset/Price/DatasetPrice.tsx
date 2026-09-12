import React from "react";
import "./DatasetPrice.css";

interface DatasetPriceProps {
  /** Price amount to display */
  price: number;
  /** Currency code (default: "USD") */
  currency?: string;
  showCurrencyCode?: boolean;
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
  showCurrencyCode = false,
  className = "",
}) => {
  const formatPrice = (amount: number, curr: string) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: curr,
      ...(showCurrencyCode
        ? { minimumFractionDigits: 0, maximumFractionDigits: 2 }
        : {}),
    });
  };

  return (
    <span className={`dataset-price ${className}`}>
      {formatPrice(price, currency)}
      {showCurrencyCode ? ` ${currency}` : ""}
    </span>
  );
};

export default DatasetPrice;
