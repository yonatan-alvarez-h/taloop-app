import React from "react";
import { useParams } from "react-router-dom";
import DatasetDetails from "./components/dataset/DatasetDetails";
import type { Dataset } from "./types/dataset";
import datasetsData from "./datasetsData";

const DatasetRouter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Busca el dataset por id (puedes adaptar la fuente de datos)
  const dataset = datasetsData.find((d: Dataset) => d.id === id);

  if (!dataset) {
    return (
      <div className="alert alert-danger mt-5 text-center">
        Dataset no encontrado
      </div>
    );
  }

  return <DatasetDetails dataset={dataset} />;
};

export default DatasetRouter;
