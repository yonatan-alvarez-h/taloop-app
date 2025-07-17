import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/menu/nav/NavBar";
import datasetsData from "../../data/datasetsData";
import DatasetDetails from "../../components/dataset/Details/DatasetDetails";
import "./DatasetDetailsPage.css";

const DatasetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dataset = datasetsData.find((d) => d.id === id);

  if (!dataset) {
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
        <div className="dataset-details-page-notfound">
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
        <div style={{ flex: "0 0 auto" }}>
          <DatasetDetails dataset={dataset} />
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailsPage;
