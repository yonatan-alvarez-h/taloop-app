import React from "react";
import type { Dataset } from "../../../types/dataset";
import "./WelcomeSection.css";

interface WelcomeSectionProps {
  datasets: Dataset[];
  onSearch: (query: string) => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  datasets,
  onSearch,
}) => {
  // Obtener algunas estadísticas rápidas
  const totalDatasets = datasets.length;
  const totalRecords = datasets.reduce(
    (sum, ds) => sum + (ds.size?.recordCount || 0),
    0
  );
  const categories = [
    ...new Set(datasets.map((ds) => ds.category).filter(Boolean)),
  ];
  const recentDatasets = datasets
    .filter((ds) => ds.timestamps?.updatedAt)
    .sort(
      (a, b) =>
        new Date(b.timestamps!.updatedAt).getTime() -
        new Date(a.timestamps!.updatedAt).getTime()
    )
    .slice(0, 3);

  const popularSearches = [
    "agricultura",
    "salud",
    "educación",
    "economia",
    "clima",
    "transporte",
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  return (
    <div className="welcome-section">
      <div className="welcome-hero">
        <div className="welcome-content">
          <div className="hero-icon">
            <span className="icon-main">📊</span>
            <div className="icon-particles">
              <span className="particle">✨</span>
              <span className="particle">💡</span>
              <span className="particle">🚀</span>
            </div>
          </div>

          <h1 className="welcome-title">
            Descubre datos que impulsan
            <span className="title-highlight"> decisiones</span>
          </h1>

          <p className="welcome-subtitle">
            Explora nuestra colección de{" "}
            <strong>{formatNumber(totalDatasets)}</strong> datasets con más de{" "}
            <strong>{formatNumber(totalRecords)}</strong> registros de datos
            actualizados y verificados.
          </p>

          <div className="quick-stats">
            <div className="stat-item stat-datasets">
              <div className="stat-icon">📈</div>
              <span className="stat-number">{formatNumber(totalDatasets)}</span>
              <span className="stat-label">Datasets</span>
            </div>
            <div className="stat-item stat-categories">
              <div className="stat-icon">🗂️</div>
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Categorías</span>
            </div>
            <div className="stat-item stat-records">
              <div className="stat-icon">💾</div>
              <span className="stat-number">{formatNumber(totalRecords)}</span>
              <span className="stat-label">Registros</span>
            </div>
          </div>

          <div className="cta-section">
            <p className="cta-text">¿Qué datos necesitas hoy?</p>
          </div>
        </div>
      </div>

      <div className="welcome-sections">
        <div className="section popular-searches">
          <div className="section-header">
            <div className="section-icon">🔥</div>
            <h3>Búsquedas populares</h3>
          </div>
          <div className="search-tags">
            {popularSearches.map((term, index) => (
              <button
                key={term}
                className="search-tag"
                onClick={() => onSearch(term)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="tag-text">{term}</span>
                <span className="tag-arrow">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="section recent-datasets">
          <div className="section-header">
            <div className="section-icon">📈</div>
            <h3>Recientemente actualizados</h3>
          </div>
          <div className="recent-list">
            {recentDatasets.length > 0 ? (
              recentDatasets.map((dataset, index) => (
                <div
                  key={dataset.uid}
                  className="recent-item"
                  onClick={() => onSearch(dataset.title)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="recent-icon">🔗</div>
                  <div className="recent-info">
                    <h4 className="recent-title">{dataset.title}</h4>
                    <p className="recent-category">{dataset.category}</p>
                  </div>
                  <div className="recent-stats">
                    <div className="recent-records">
                      {formatNumber(dataset.size?.recordCount || 0)} registros
                    </div>
                    <div className="recent-arrow">↗</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No hay datasets con información temporal disponible</p>
              </div>
            )}
          </div>
        </div>

        <div className="section categories-overview">
          <div className="section-header">
            <div className="section-icon">📁</div>
            <h3>Explora por categoría</h3>
          </div>
          <div className="categories-grid">
            {categories.length > 0 ? (
              categories.slice(0, 6).map((category, index) => {
                const count = datasets.filter(
                  (ds) => ds.category === category
                ).length;
                const categoryIcons = {
                  agricultura: "🌾",
                  salud: "🏥",
                  educación: "📚",
                  economia: "💰",
                  clima: "🌡️",
                  transporte: "🚗",
                  default: "📊",
                };
                const iconKey =
                  category?.toLowerCase() as keyof typeof categoryIcons;
                const icon = categoryIcons[iconKey] || categoryIcons.default;

                return (
                  <button
                    key={category}
                    className="category-card"
                    onClick={() => onSearch(category!)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="category-icon">{icon}</div>
                    <span className="category-name">{category}</span>
                    <span className="category-count">{count} datasets</span>
                  </button>
                );
              })
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏷️</div>
                <p>No hay categorías disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
