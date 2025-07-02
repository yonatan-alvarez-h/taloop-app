import React from "react";

interface DatasetTagsProps {
  tags: string[];
  className?: string;
  style?: React.CSSProperties;
}

const DatasetTags: React.FC<DatasetTagsProps> = ({ tags, className, style }) => (
  <div className={className} style={{ display: "flex", flexWrap: "wrap", gap: 6, ...style }}>
    {tags.map((tag) => (
      <span
        key={tag}
        className="dataset-tag"
        style={{ fontSize: "0.87em", padding: '2px 8px', borderRadius: 8, background: '#f3f4f6', color: '#374151', marginBottom: 2 }}
      >
        {tag}
      </span>
    ))}
  </div>
);

export default DatasetTags;
