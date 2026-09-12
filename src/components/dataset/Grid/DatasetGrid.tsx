import React, { useEffect } from "react";
import type { Dataset } from "../../../types/dataset";
import { useAuth } from "../../../context/useAuth";
import { useFavorites } from "../../../context/useFavorites";
import DatasetCard from "../Card";
import "./DatasetGrid.css";

interface DatasetGridProps {
  datasets: Dataset[];
}

const DatasetGrid: React.FC<DatasetGridProps> = ({ datasets }) => {
  const { isAuthenticated } = useAuth();
  const { ensureMemberships } = useFavorites();
  const datasetIds = datasets
    .map((dataset) => dataset._id)
    .filter(Boolean)
    .join("|");

  useEffect(() => {
    if (!isAuthenticated || !datasetIds) return;
    void ensureMemberships(datasetIds.split("|")).catch(() => undefined);
  }, [datasetIds, ensureMemberships, isAuthenticated]);

  return (
    <ul className="dataset-grid-wrapper" aria-label="Datasets disponibles">
      {datasets.map((ds) => (
        <DatasetCard key={ds._id || ds.title} dataset={ds} variant="compact" />
      ))}
    </ul>
  );
};

export default DatasetGrid;
