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
      <DetailsHeader dataset={dataset} />
      <DetailsDashboard dataset={dataset} />
    </div>
  );
};

export default DatasetDetails;
