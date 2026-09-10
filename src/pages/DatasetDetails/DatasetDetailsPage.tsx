import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import Loading from "../../components/UI/Loading";
import { fetchDatasetById } from "../../services/datasetsService";
import { fetchDatasetPreview } from "../../services/datasetsService";
import DatasetDetails from "../../components/Dataset/Details/DatasetDetails";
import type { DatasetWithSamples } from "../../types/dataset";
import { useAuth } from "../../context/useAuth";
import "./DatasetDetailsPage.css";

const DatasetDetailsPage: React.FC = () => {
  const { _id } = useParams<{ _id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [dataset, setDataset] = useState<DatasetWithSamples | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackToResults = () => {
    if (document.referrer) {
      try {
        if (new URL(document.referrer).origin === window.location.origin) {
          navigate(-1);
          return;
        }
      } catch {
        // Si el referrer no es válido, se usa el catálogo como destino seguro.
      }
    }

    navigate("/");
  };

  useEffect(() => {
    if (!_id) return;
    setLoading(true);
    fetchDatasetById(_id)
      .then(async (loadedDataset) => {
        if (!isAuthenticated) {
          setDataset({ ...loadedDataset, previewAvailable: false });
          return;
        }

        try {
          const preview = await fetchDatasetPreview(_id);
          setDataset({
            ...loadedDataset,
            samples: preview.samples,
            isLimited: preview.isLimited,
            previewAvailable: true,
          });
        } catch {
          setDataset({ ...loadedDataset, previewAvailable: false });
        }
      })
      .catch(() => setError("No se pudo cargar el dataset"))
      .finally(() => setLoading(false));
  }, [_id, isAuthenticated]);

  if (loading) {
    return (
      <div>
        <AppHeader />
        <div className="dataset-details-page-notfound dataset-details-page-notfound--with-navbar d-flex justify-content-center align-items-center">
          <Loading
            size="lg"
            variant="spinner"
            text="Cargando dataset..."
            color="primary"
          />
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div>
        <AppHeader />
        <div className="dataset-details-page-notfound dataset-details-page-notfound--with-navbar">
          <p>Dataset no encontrado.</p>
          <Link
            to="/"
            className="dataset-details-page-error-back-link"
            onClick={(event) => {
              event.preventDefault();
              handleBackToResults();
            }}
          >
            ← Volver a resultados
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppHeader />
      <div className="dataset-details-page-container container">
        <div className="dataset-details-page-content">
          <DatasetDetails dataset={dataset} onBackToResults={handleBackToResults} />
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailsPage;
