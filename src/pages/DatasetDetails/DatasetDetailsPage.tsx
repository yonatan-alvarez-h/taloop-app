import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import datasetsData from "../../data/datasetsData";
import DatasetDetails from "../../components/dataset/Details/DatasetDetails";
import "./DatasetDetailsPage.css";

const DatasetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dataset = datasetsData.find((d) => d.id === id);

  if (!dataset) {
    return (
      <div className="dataset-details-notfound">Dataset no encontrado.</div>
    );
  }

  return (
    <div>
      <nav className="homepage-navbar">
        <div className="homepage-navbar-brand">
          <span className="navbar-brand ms-2">taloop</span>
        </div>
        <div className="homepage-back-btn-container">
          <button
            onClick={() => navigate(-1)}
            className="dataset-details-back-btn"
          >
            ← Volver
          </button>
        </div>
      </nav>
      <div className="dataset-details-container container">
        <div style={{ flex: "0 0 auto" }}>
          <DatasetDetails dataset={dataset} />
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailsPage;
