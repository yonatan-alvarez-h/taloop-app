import React from "react";
import type { Dataset } from "../../../../types/dataset";
import DatasetMetadata from "../../Metadata";
import DataQuality from "../../Quality/DataQuality";
import SectionTitle from "../Section/SectionTitle";
import "./DetailsDashboard.css";

interface DetailsDashboardProps {
  dataset: Dataset;
}

const DetailsDashboard: React.FC<DetailsDashboardProps> = ({ dataset }) => {
  return (
    <div className="details-dashboard">
      <div className="details-dashboard-left">
        <SectionTitle>Información del Dataset</SectionTitle>
        <DatasetMetadata dataset={dataset} />
      </div>

      <div className="details-dashboard-right">
        <SectionTitle>Calidad de Datos</SectionTitle>
        {dataset.dataQuality ? (
          <DataQuality dataQuality={dataset.dataQuality} />
        ) : (
          <div className="details-dashboard-no-data-quality">
            <p>
              Información de calidad de datos no disponible para este dataset.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsDashboard;
