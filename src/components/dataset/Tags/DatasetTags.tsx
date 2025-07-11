import React from "react";
import "./DatasetTags.css";

interface DatasetTagsProps {
  tags: string[];
  className?: string;
  style?: React.CSSProperties;
}

const DatasetTags: React.FC<DatasetTagsProps> = ({
  tags,
  className,
  style,
}) => (
  <div
    className={className}
    style={{ display: "flex", flexWrap: "wrap", gap: 6, ...style }}
  >
    {tags.map((tag) => (
      <span key={tag} className="dataset-tag">
        {tag}
      </span>
    ))}
  </div>
);

export default DatasetTags;
