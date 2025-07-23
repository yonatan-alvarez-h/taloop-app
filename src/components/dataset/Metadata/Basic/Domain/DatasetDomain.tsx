import React from "react";
import "./DatasetDomain.css";

interface DatasetDomainProps {
  industry: string;
  subDomain?: string;
}

const DatasetDomain: React.FC<DatasetDomainProps> = ({
  industry,
  subDomain,
}) => {
  const getIndustryIcon = (industry: string) => {
    switch (industry.toLowerCase()) {
      case "agricultura":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A2,2,0,0,1,14,4C14,5.5,13,6.19,13,7.5V9A2,2,0,0,1,11,11H10V12H11A1,1,0,0,1,12,13V22H10V13A3,3,0,0,0,7,10H6V9A2,2,0,0,0,4,7V6A2,2,0,0,1,2,4A2,2,0,0,1,4,2A2,2,0,0,1,6,4A2,2,0,0,0,8,6V7A2,2,0,0,0,10,9V8.5C10,7.19,9,6.5,9,5A3,3,0,0,1,12,2Z" />
          </svg>
        );
      case "salud":
      case "healthcare":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L13.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z" />
          </svg>
        );
      case "educación":
      case "education":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,3L1,9L12,15L21,10.09V17H23V9L12,3M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
          </svg>
        );
      case "tecnología":
      case "technology":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,17H7V7H17M21,11V9H19V7A2,2,0,0,0,17,5H15V3H13V5H11V3H9V5H7A2,2,0,0,0,5,7V9H3V11H5V13H3V15H5V17A2,2,0,0,0,7,19H9V21H11V19H13V21H15V19H17A2,2,0,0,0,19,17V15H21V13H19V11M16,8H8V16H16V8Z" />
          </svg>
        );
      case "finanzas":
      case "finance":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5,6H23V18H5V6M14,9A3,3,0,0,1,17,12A3,3,0,0,1,14,15A3,3,0,0,1,11,12A3,3,0,0,1,14,9M9,8A2,2,0,0,1,7,10V14A2,2,0,0,1,9,16M19,8A2,2,0,0,1,21,10V14A2,2,0,0,1,19,16" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L2,7V10C2,16,6,21,12,22C18,21,22,16,22,10V7L12,2M12,4.14L20,8.23V10C20,15.06,16.67,19.43,12,20C7.33,19.43,4,15.06,4,10V8.23L12,4.14Z" />
          </svg>
        );
    }
  };

  const getIndustryColor = (industry: string) => {
    switch (industry.toLowerCase()) {
      case "agricultura":
        return "#22c55e";
      case "salud":
      case "healthcare":
        return "#ef4444";
      case "educación":
      case "education":
        return "#3b82f6";
      case "tecnología":
      case "technology":
        return "#8b5cf6";
      case "finanzas":
      case "finance":
        return "#f59e0b";
      default:
        return "#6366f1";
    }
  };

  return (
    <div className="dataset-domain">
      <div className="domain-header">
        <div
          className="industry-badge"
          style={{ backgroundColor: getIndustryColor(industry) }}
        >
          <div className="industry-icon">{getIndustryIcon(industry)}</div>
          <span className="industry-name">{industry}</span>
        </div>

        {subDomain && (
          <div className="sub-domain">
            <span className="sub-domain-label">Área:</span>
            <span className="sub-domain-value">{subDomain}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetDomain;
