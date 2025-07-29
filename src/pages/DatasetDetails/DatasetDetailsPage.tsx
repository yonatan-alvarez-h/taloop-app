import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/Menu/Nav/NavBar";
import { fetchDatasetById } from "../../services/datasetsService";
import DatasetDetails from "../../components/Dataset/Details/DatasetDetails";
import type { DatasetWithSamples } from "../../types/dataset";
import "./DatasetDetailsPage.css";

const DatasetDetailsPage: React.FC = () => {
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

  if (loading) {
    return (
      <div>
        <nav className="navbar">
          <NavBar />
        </nav>
        <div className="dataset-details-page-notfound dataset-details-page-notfound--with-navbar">
          Cargando dataset...
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div>
        <nav className="navbar">
          <NavBar />
          <div className="dataset-details-page-back-btn-container">
            <button
              onClick={() => navigate(-1)}
              className="dataset-details-page-back-btn"
            >
              ← Volver
            </button>
          </div>
        </nav>
        <div className="dataset-details-page-notfound dataset-details-page-notfound--with-navbar">
          Dataset no encontrado.
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <NavBar />
        <div className="dataset-details-page-back-btn-container">
          <button
            type="submit"
            onClick={() => navigate(-1)}
            className="dataset-details-page-back-btn"
          >
            ← Volver
          </button>
        </div>
      </nav>
      <div className="dataset-details-page-container container">
        <div className="dataset-details-page-content">
          <DatasetDetails dataset={dataset} />
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailsPage;
