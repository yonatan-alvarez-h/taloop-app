import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/Menu/Nav/NavBar";
import datasetsData from "../../data/datasetsData";
import DatasetDetails from "../../components/Dataset/Details/DatasetDetails";
import "./DatasetDetailsPage.css";

const DatasetDetailsPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const dataset = datasetsData.find((d) => d.uid === uid);

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
        <div className="dataset-details-page-content">
          <DatasetDetails dataset={dataset} />
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailsPage;
