import React from "react";
import type { Dataset } from "../../types/dataset";
import DatasetCard from "./Card/DatasetCard";

interface DatasetGridProps {
  datasets: Dataset[];
}

const DatasetGrid: React.FC<DatasetGridProps> = ({ datasets }) => {
  return (
    <div
      className="row g-4"
      style={{ listStyle: "none", margin: 0, padding: 0 }}
    >
      {datasets.map((ds) => (
        <div key={ds.id} className="col-12 col-md-6">
          <DatasetCard dataset={ds} />
        </div>
      ))}
    </div>
  );
};

export default DatasetGrid;
