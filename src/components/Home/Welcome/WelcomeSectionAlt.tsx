import React from "react";
import type { Dataset } from "../../../types/dataset";
import "./WelcomeSectionAlt.css";

interface WelcomeSectionAltProps {
  datasets: Dataset[];
  onSearch: (query: string) => void;
}

const WelcomeSectionAlt: React.FC<WelcomeSectionAltProps> = ({
  datasets,
  onSearch,
}) => {
  // Obtener las métricas principales
  const totalDatasets = datasets.length;
  const totalCategories = [
    ...new Set(datasets.map((ds) => ds.category).filter(Boolean)),
  ].length;
  const totalProviders = [
    ...new Set(datasets.map((ds) => ds.owner.name).filter(Boolean)),
  ].length;

  const categories = [
    ...new Set(datasets.map((ds) => ds.category).filter(Boolean)),
  ];

  // Obtener los principales proveedores
  const topProviders = Object.entries(
    datasets.reduce((acc, ds) => {
      const providerName = ds.owner.name;
      acc[providerName] = (acc[providerName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));

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
    <div className="welcome-section-alt">
      {/* Header Section */}
      <div className="welcome-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="brand-logo">
              <div className="logo-icon">📊</div>
              <div className="logo-pulse"></div>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">Impulsa tus decisiones</h1>
              <p className="brand-subtitle">
                Con datos inteligentes que transforman tu negocio
              </p>
            </div>
          </div>

          <div className="stats-overview">
            <div className="overview-grid">
              <div className="overview-card datasets-card">
                <div className="card-icon">�</div>
                <div className="card-content">
                  <h3>{formatNumber(totalDatasets)}</h3>
                  <p>Datasets</p>
                </div>
              </div>
              <div className="overview-card categories-card">
                <div className="card-icon">🗂️</div>
                <div className="card-content">
                  <h3>{totalCategories}</h3>
                  <p>Categorías</p>
                </div>
              </div>
              <div className="overview-card providers-card">
                <div className="card-icon">🏢</div>
                <div className="card-content">
                  <h3>{totalProviders}</h3>
                  <p>Proveedores de Datos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="welcome-main">
        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="section-title">
            <h2>Acceso Rápido</h2>
            <p>Encuentra lo que necesitas de forma eficiente</p>
          </div>

          <div className="actions-grid">
            <div className="action-card popular-card">
              <div className="action-header">
                <div className="action-icon trending">🔥</div>
                <h3>Tendencias</h3>
              </div>
              <div className="action-content">
                <p className="action-description">
                  Explora los datasets más buscados
                </p>
                <div className="trending-tags">
                  {popularSearches.slice(0, 4).map((term, index) => (
                    <button
                      key={term}
                      className="trending-tag"
                      onClick={() => onSearch(term)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="action-card categories-card-main">
              <div className="action-header">
                <div className="action-icon categories">📂</div>
                <h3>Por Categoría</h3>
              </div>
              <div className="action-content">
                <p className="action-description">
                  Navega por áreas de conocimiento
                </p>
                <div className="category-showcase">
                  {categories.slice(0, 3).map((category, index) => {
                    const count = datasets.filter(
                      (ds) => ds.category === category
                    ).length;
                    return (
                      <div
                        key={category}
                        className="category-item"
                        onClick={() => onSearch(category!)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="category-label">{category}</span>
                        <span className="category-badge">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="action-card providers-card-main">
              <div className="action-header">
                <div className="action-icon providers">🏢</div>
                <h3>Principales Proveedores</h3>
              </div>
              <div className="action-content">
                <p className="action-description">
                  Organizaciones que más datasets aportan
                </p>
                <div className="providers-showcase">
                  {topProviders.length > 0 ? (
                    topProviders.map((provider, index) => (
                      <div
                        key={provider.name}
                        className="provider-preview"
                        onClick={() => onSearch(provider.name)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="provider-info">
                          <div className="provider-name">{provider.name}</div>
                          <div className="provider-type">
                            {datasets.find(
                              (ds) => ds.owner.name === provider.name
                            )?.owner.type === "empresa"
                              ? "🏢 Empresa"
                              : "👤 Usuario"}
                          </div>
                        </div>
                        <div className="provider-stats">
                          <span className="provider-count">
                            {provider.count}
                          </span>
                          <span className="provider-label">datasets</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-providers">
                      <span>No hay proveedores disponibles</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="features-section">
          <div className="section-title">
            <h2>¿Por qué elegir Taloop?</h2>
            <p>Potencia tus decisiones con datos confiables</p>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h4>Datos Verificados</h4>
              <p>Información validada y actualizada regularmente</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h4>Acceso Rápido</h4>
              <p>Búsqueda inteligente y descarga inmediata</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Múltiples Formatos</h4>
              <p>CSV, JSON, Excel y más formatos disponibles</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h4>Calidad Garantizada</h4>
              <p>Métricas de calidad y documentación completa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSectionAlt;
