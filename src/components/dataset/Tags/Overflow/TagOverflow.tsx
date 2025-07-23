import React, { useState } from "react";
import TagList from "../List";
import "./TagOverflow.css";

interface TagOverflowProps {
  tags: string[];
  maxVisible?: number;
  variant?: "default" | "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  layout?: "horizontal" | "vertical" | "wrap";
  gap?: number;
  clickable?: boolean;
  expandable?: boolean;
  onTagClick?: (tag: string) => void;
}

const TagOverflow: React.FC<TagOverflowProps> = ({
  tags,
  maxVisible = 5,
  variant = "default",
  size = "medium",
  layout = "wrap",
  gap = 8,
  clickable = false,
  expandable = true,
  onTagClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleTags = isExpanded ? tags : tags.slice(0, maxVisible);
  const hiddenCount = tags.length - maxVisible;

  const toggleExpanded = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="tag-overflow">
      <TagList
        tags={visibleTags}
        variant={variant}
        size={size}
        layout={layout}
        gap={gap}
        clickable={clickable}
        onTagClick={onTagClick}
      />

      {hiddenCount > 0 && !isExpanded && (
        <span
          className={`tag-overflow__more tag-overflow__more--${size}`}
          onClick={toggleExpanded}
          role={expandable ? "button" : undefined}
          tabIndex={expandable ? 0 : undefined}
        >
          +{hiddenCount} más
        </span>
      )}

      {isExpanded && expandable && (
        <span
          className={`tag-overflow__less tag-overflow__less--${size}`}
          onClick={toggleExpanded}
          role="button"
          tabIndex={0}
        >
          mostrar menos
        </span>
      )}
    </div>
  );
};

export default TagOverflow;
