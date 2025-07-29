import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatasetDetails from "./components/Dataset/Details/DatasetDetails";
import type { DatasetWithSamples } from "./types/dataset";
import { fetchDatasetById } from "./services/datasetsService";

const DatasetRouter: React.FC = () => {
  const { _id } = useParams<{ _id: string }>();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState<DatasetWithSamples | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!_id) return;
    setLoading(true);
    fetchDatasetById(_id)
      .then(setDataset)
      .catch(() => setError("No se pudo cargar el dataset"))
      .finally(() => setLoading(false));
  }, [_id]);

  useEffect(() => {
    console.log("dataset", dataset);
  }, [dataset]);

  if (loading) {
    return <div className="mt-5 text-center">Cargando dataset...</div>;
  }

  if (error || !dataset) {
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
