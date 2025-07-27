import React, { useEffect, useState } from "react";
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

  // Hook personalizado para animación de contador
  const useCountUp = (
    end: number,
    duration: number = 2000,
    start: number = 0
  ) => {
    const [count, setCount] = useState(start);

    useEffect(() => {
      if (end === 0) return;

      let startTime: number;
      const startValue = start;
      const endValue = end;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Función de easing suave
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(
          startValue + (endValue - startValue) * easeOutQuart
        );

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [end, duration, start]);

    return count;
  };

  // Contadores animados con diferentes duraciones para efecto escalonado
  const animatedDatasets = useCountUp(totalDatasets, 2500);
  const animatedCategories = useCountUp(totalCategories, 2000);
  const animatedProviders = useCountUp(totalProviders, 1800);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  return (
    <div className="welcome-section">
      <div className="welcome-hero">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Descubre datos que impulsan
            <span className="title-highlight"> mejores decisiones</span>
          </h1>

          <p className="welcome-subtitle">
            Explora nuestra colección de{" "}
            <strong>{formatNumber(animatedDatasets)}</strong> datasets
            organizados en <strong>{animatedCategories}</strong> categorías, con
            datos de <strong>{animatedProviders}</strong> proveedores
            verificados.
          </p>

          <div className="quick-stats">
            <div className="stat-item stat-categories">
              <span className="stat-number">{animatedCategories}</span>
              <span className="stat-label">Categorías</span>
            </div>
            <div className="stat-item stat-records">
              <span className="stat-number">{animatedProviders}</span>
              <span className="stat-label">Proveedores</span>
            </div>
            <div className="stat-item stat-datasets">
              <span className="stat-number">
                {formatNumber(animatedDatasets)}
              </span>
              <span className="stat-label">Datasets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
