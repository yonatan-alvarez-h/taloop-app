import React from "react";
import TagList from "./List";
import TagOverflow from "./Overflow";
import "./DatasetTags.css";

interface DatasetTagsProps {
  tags: string[];
  className?: string;
  style?: React.CSSProperties;
  variant?: "default" | "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  layout?: "horizontal" | "vertical" | "wrap";
  gap?: number;
  maxVisible?: number;
  clickable?: boolean;
  expandable?: boolean;
  onTagClick?: (tag: string) => void;
}

const DatasetTags: React.FC<DatasetTagsProps> = ({
  tags,
  className,
  style,
  variant = "default",
  size = "medium",
  layout = "wrap",
  gap = 8,
  maxVisible,
  clickable = false,
  expandable = true,
  onTagClick,
}) => {
  const shouldShowOverflow = maxVisible && tags.length > maxVisible;

  if (shouldShowOverflow) {
    return (
      <div className={`dataset-tags ${className || ""}`} style={style}>
        <TagOverflow
          tags={tags}
          maxVisible={maxVisible}
          variant={variant}
          size={size}
          layout={layout}
          gap={gap}
          clickable={clickable}
          expandable={expandable}
          onTagClick={onTagClick}
        />
      </div>
    );
  }

  return (
    <div className={`dataset-tags ${className || ""}`} style={style}>
      <TagList
        tags={tags}
        variant={variant}
        size={size}
        layout={layout}
        gap={gap}
        clickable={clickable}
        onTagClick={onTagClick}
      />
    </div>
  );
};

export default DatasetTags;
