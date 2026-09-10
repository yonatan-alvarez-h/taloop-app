import React from "react";
import type { Dataset } from "../../../types/dataset";
import DetailsHeader from "./Header/DetailsHeader";
import DetailsDashboard from "./Dashboard/DetailsDashboard";

import "./DatasetDetails.css";

interface DatasetDetailsProps {
  dataset: Dataset;
}

const DatasetDetails: React.FC<DatasetDetailsProps> = ({ dataset }) => {
  return (
    <div className="dataset-details-container">
      <header className="dataset-details-header">
        <DetailsHeader dataset={dataset} />
      </header>
      <main className="dataset-details-content">
        <DetailsDashboard dataset={dataset} />
      </main>
    </div>
  );
};

export default DatasetDetails;
