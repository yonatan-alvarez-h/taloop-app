import React from "react";
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
        <button
          key={index}
          className={getButtonClass(action)}
          onClick={action.onClick}
          disabled={action.disabled}
          type="button"
        >
          {action.icon && (
            <span className="card-actions__button-icon">{action.icon}</span>
          )}
          <span className="card-actions__button-text">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CardActions;
