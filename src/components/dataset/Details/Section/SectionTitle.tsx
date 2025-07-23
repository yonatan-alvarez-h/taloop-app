import React from "react";
import "./SectionTitle.css";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`details-section-title ${className}`}>
      <h3>{children}</h3>
    </div>
  );
};

export default SectionTitle;
