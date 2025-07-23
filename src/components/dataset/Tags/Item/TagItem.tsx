import React from "react";
import "./TagItem.css";

interface TagItemProps {
  tag: string;
  variant?: "default" | "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  clickable?: boolean;
  removable?: boolean;
  onClick?: (tag: string) => void;
  onRemove?: (tag: string) => void;
}

const TagItem: React.FC<TagItemProps> = ({
  tag,
  variant = "default",
  size = "medium",
  clickable = false,
  removable = false,
  onClick,
  onRemove,
}) => {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick(tag);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tag);
    }
  };

  return (
    <span
      className={`
        tag-item 
        tag-item--${variant} 
        tag-item--${size}
        ${clickable ? "tag-item--clickable" : ""}
        ${removable ? "tag-item--removable" : ""}
      `}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <span className="tag-item__text">{tag}</span>
      {removable && (
        <button
          className="tag-item__remove"
          onClick={handleRemove}
          aria-label={`Eliminar tag ${tag}`}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default TagItem;
