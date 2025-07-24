import React from "react";
import type { Dataset } from "../../../../types/dataset";
import { useTabs } from "./hooks/useTabs";
import { TabNavigation, TabContent } from "./components";
import "./DetailsDashboard.css";

interface DetailsDashboardProps {
  dataset: Dataset;
}

const DetailsDashboard: React.FC<DetailsDashboardProps> = ({ dataset }) => {
  const { activeTab, tabs, switchTab } = useTabs("information");

  return (
    <div className="details-dashboard">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={switchTab}
      />
      <TabContent dataset={dataset} activeTab={activeTab} />
    </div>
  );
};

export default DetailsDashboard;
