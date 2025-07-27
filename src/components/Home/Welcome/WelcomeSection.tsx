import React from "react";
import type { Dataset } from "../../../types/dataset";
import "./WelcomeSection.css";

interface WelcomeSectionProps {
  datasets: Dataset[];
  onSearch: (query: string) => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ datasets }) => {
  // Obtener las métricas principales
  const totalDatasets = datasets.length;
  const totalCategories = [
    ...new Set(datasets.map((ds) => ds.category).filter(Boolean)),
  ].length;
  const totalProviders = [
    ...new Set(datasets.map((ds) => ds.owner.name).filter(Boolean)),
  ].length;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  return (
    <div className="welcome-section">
      <div className="welcome-hero">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Descubre datos que impulsan
            <span className="title-highlight"> decisiones</span>
          </h1>

          <p className="welcome-subtitle">
            Explora nuestra colección de{" "}
            <strong>{formatNumber(totalDatasets)}</strong> datasets organizados
            en <strong>{totalCategories}</strong> categorías, con datos de{" "}
            <strong>{totalProviders}</strong> proveedores verificados.
          </p>

          <div className="quick-stats">
            <div className="stat-item stat-categories">
              <span className="stat-number">{totalCategories}</span>
              <span className="stat-label">Categorías</span>
            </div>
            <div className="stat-item stat-records">
              <span className="stat-number">{totalProviders}</span>
              <span className="stat-label">Proveedores</span>
            </div>
            <div className="stat-item stat-datasets">
              <span className="stat-number">{formatNumber(totalDatasets)}</span>
              <span className="stat-label">Datasets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
