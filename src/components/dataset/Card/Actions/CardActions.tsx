import React from "react";
import Button from "../../../UI/Button";
import "./CardActions.css";

interface CardAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "link";
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface CardActionsProps {
  actions: CardAction[];
  layout?: "horizontal" | "vertical" | "stacked";
  size?: "small" | "medium" | "large";
  variant?: "default" | "compact" | "detailed";
}

const CardActions: React.FC<CardActionsProps> = ({
  actions,
  layout = "horizontal",
  size = "medium",
  variant = "default",
}) => {
  if (actions.length === 0) {
    return null;
  }

  const getButtonClass = (action: CardAction) => {
    const baseClass = "card-actions__button";
    const sizeClass = `${baseClass}--${size}`;
    const variantClass = `${baseClass}--${action.variant || "primary"}`;
    const disabledClass = action.disabled ? `${baseClass}--disabled` : "";

    return `${baseClass} ${sizeClass} ${variantClass} ${disabledClass}`.trim();
  };

  return (
    <div
      className={`card-actions card-actions--${layout} card-actions--${variant}`}
    >
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "primary"}
          size={size === "small" ? "sm" : size === "large" ? "lg" : "md"}
          onClick={action.onClick}
          disabled={action.disabled}
          leftIcon={action.icon}
          className="card-actions__button"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default CardActions;
