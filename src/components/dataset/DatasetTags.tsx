import React from "react";

interface DatasetTagsProps {
  tags: string[];
  className?: string;
  style?: React.CSSProperties;
}

const DatasetTags: React.FC<DatasetTagsProps> = ({ tags, className, style }) => (
  <div className={className} style={{ display: "flex", flexWrap: "wrap", gap: 8, ...style }}>
    {tags.map((tag) => (
      <span
        key={tag}
        className="dataset-tag"
        style={{ fontSize: "0.98em" }}
      >
        {tag}
      </span>
    ))}
  </div>
);

export default DatasetTags;
