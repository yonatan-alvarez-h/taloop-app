import React from "react";
import type { Dataset } from "../../../types/dataset";
import DatasetCard from "../Card";
import "./DatasetGrid.css";

interface DatasetGridProps {
  datasets: Dataset[];
}

const DatasetGrid: React.FC<DatasetGridProps> = ({ datasets }) => {
  return (
    <div className="row g-4 dataset-grid-wrapper">
      {datasets.map((ds) => (
        <div key={ds.uid} className="col-12 col-md-6">
          <DatasetCard dataset={ds} />
        </div>
      ))}
    </div>
  );
};

export default DatasetGrid;
