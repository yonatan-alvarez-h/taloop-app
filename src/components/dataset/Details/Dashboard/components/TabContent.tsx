import React from "react";
import type { Dataset } from "../../../../../types/dataset";
import type { TabId } from "../hooks/useTabs";
import DatasetMetadata from "../../../Metadata";
import DataQuality from "../../../Quality/DataQuality";
import DatasetPreview from "../../../Preview";
import "./TabContent.css";

interface TabContentProps {
  dataset: Dataset;
  activeTab: TabId;
}

const TabContent: React.FC<TabContentProps> = ({ dataset, activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "information":
        return (
          <div
            className="tab-content"
            id="tabpanel-information"
            role="tabpanel"
          >
            <DatasetMetadata dataset={dataset} />
          </div>
        );

      case "quality":
        return (
          <div className="tab-content" id="tabpanel-quality" role="tabpanel">
            {dataset.dataQuality ? (
              <DataQuality dataQuality={dataset.dataQuality} />
            ) : (
              <div className="no-data-quality">
                <div className="no-data-icon">📊</div>
                <h3>Información de Calidad no Disponible</h3>
                <p>
                  Este dataset no tiene información de calidad de datos
                  disponible en este momento.
                </p>
              </div>
            )}
          </div>
        );

      case "preview":
        return (
          <div className="tab-content" id="tabpanel-preview" role="tabpanel">
            <DatasetPreview dataset={dataset} />
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="tab-content-container">{renderContent()}</div>;
};

export default TabContent;
