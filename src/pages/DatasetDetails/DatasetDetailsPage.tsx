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
    <div className="dataset-details-page">
      <nav className="homepage-navbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="navbar-brand ms-2">taloop</span>
        </div>
      </nav>
      <button onClick={() => navigate(-1)} className="dataset-details-back-btn">
        ← Volver
      </button>
      <DatasetDetails dataset={dataset} />
    </div>
  );
};

export default DatasetDetailsPage;
