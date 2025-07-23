import React from "react";
import TagItem from "../Item";
import "./TagList.css";

interface TagListProps {
  tags: string[];
  variant?: "default" | "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  layout?: "horizontal" | "vertical" | "wrap";
  gap?: number;
  clickable?: boolean;
  removable?: boolean;
  onTagClick?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  variant = "default",
  size = "medium",
  layout = "wrap",
  gap = 8,
  clickable = false,
  removable = false,
  onTagClick,
  onTagRemove,
}) => {
  return (
    <div className={`tag-list tag-list--${layout}`} style={{ gap: `${gap}px` }}>
      {tags.map((tag, index) => (
        <TagItem
          key={`${tag}-${index}`}
          tag={tag}
          variant={variant}
          size={size}
          clickable={clickable}
          removable={removable}
          onClick={onTagClick}
          onRemove={onTagRemove}
        />
      ))}
    </div>
  );
};

export default TagList;
