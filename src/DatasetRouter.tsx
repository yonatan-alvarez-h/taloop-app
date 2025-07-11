import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatasetDetails from "./components/dataset/Details/DatasetDetails";
import type { Dataset } from "./types/dataset";
import datasetsData from "./data/datasetsData";

const DatasetRouter: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const dataset = datasetsData.find((d: Dataset) => d.id === id);

  if (!dataset) {
    return (
      <div className="alert alert-danger mt-5 text-center">
        Dataset no encontrado
        <div className="mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(-1)}
          >
            ← Volver a la búsqueda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        className="btn btn-outline-primary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Volver a la búsqueda
      </button>
      <DatasetDetails dataset={dataset} />
    </div>
  );
};

export default DatasetRouter;
