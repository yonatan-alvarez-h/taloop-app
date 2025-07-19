import React from "react";
import "./SpiderChart.css";

interface SpiderChartProps {
  metrics: Array<{
    key: string;
    label: string;
    value: number;
    description: string;
  }>;
  size?: number;
}

const SpiderChart: React.FC<SpiderChartProps> = ({ metrics, size = 260 }) => {
  const center = size / 2;
  const radius = size * 0.35;
  const levels = 5; // Número de niveles en el gráfico (20, 40, 60, 80, 100)

  // Calcular posiciones de los puntos para cada métrica
  const getPointPosition = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2; // -π/2 para empezar desde arriba
    const distance = (value / 100) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  // Calcular posiciones de las etiquetas
  const getLabelPosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
    const labelRadius = radius * 1.15;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
    };
  };

  // Generar los puntos del polígono de datos
  const dataPoints = metrics.map((metric, index) =>
    getPointPosition(index, metric.value)
  );

  const dataPath =
    dataPoints
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + " Z";

  // Generar líneas de los ejes
  const axisLines = metrics.map((_, index) => {
    const endPoint = getPointPosition(index, 100);
    return (
      <line
        key={`axis-${index}`}
        x1={center}
        y1={center}
        x2={endPoint.x}
        y2={endPoint.y}
        className="spider-chart-axis"
      />
    );
  });

  // Generar círculos de nivel (20%, 40%, 60%, 80%, 100%)
  const levelCircles = Array.from({ length: levels }, (_, index) => {
    const levelRadius = ((index + 1) * radius) / levels;
    const opacity = 0.3 - index * 0.05; // Decreasing opacity
    return (
      <circle
        key={`level-${index}`}
        cx={center}
        cy={center}
        r={levelRadius}
        className="spider-chart-level"
        style={{ opacity }}
      />
    );
  });

  // Generar etiquetas de porcentaje en los círculos
  const levelLabels = Array.from({ length: levels }, (_, index) => {
    const levelValue = ((index + 1) * 100) / levels;
    const labelRadius = ((index + 1) * radius) / levels;
    return (
      <text
        key={`level-label-${index}`}
        x={center}
        y={center - labelRadius + 5}
        className="spider-chart-level-label"
        textAnchor="middle"
      >
        {levelValue}%
      </text>
    );
  });

  // Color del área basado en el promedio de los valores
  const averageValue =
    metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
  const getAreaColor = (avg: number) => {
    if (avg >= 90) return "rgba(34, 197, 94, 0.2)"; // Verde
    if (avg >= 80) return "rgba(132, 204, 22, 0.2)"; // Verde claro
    if (avg >= 70) return "rgba(234, 179, 8, 0.2)"; // Amarillo
    if (avg >= 60) return "rgba(249, 115, 22, 0.2)"; // Naranja
    return "rgba(239, 68, 68, 0.2)"; // Rojo
  };

  const getStrokeColor = (avg: number) => {
    if (avg >= 90) return "#22c55e"; // Verde
    if (avg >= 80) return "#84cc16"; // Verde claro
    if (avg >= 70) return "#eab308"; // Amarillo
    if (avg >= 60) return "#f97316"; // Naranja
    return "#ef4444"; // Rojo
  };

  return (
    <div className="spider-chart-container">
      <svg
        width={size}
        height={size}
        className="spider-chart-svg"
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Círculos de nivel */}
        {levelCircles}

        {/* Etiquetas de nivel */}
        {levelLabels}

        {/* Ejes */}
        {axisLines}

        {/* Área de datos */}
        <path
          d={dataPath}
          className="spider-chart-area"
          style={{
            fill: getAreaColor(averageValue),
            stroke: getStrokeColor(averageValue),
          }}
        />

        {/* Puntos de datos */}
        {dataPoints.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            className="spider-chart-point"
            style={{ fill: getStrokeColor(averageValue) }}
          />
        ))}
      </svg>

      {/* Etiquetas de métricas */}
      <div className="spider-chart-labels">
        {metrics.map((metric, index) => {
          const position = getLabelPosition(index);
          return (
            <div
              key={`label-${metric.key}`}
              className="spider-chart-label"
              style={{
                left: position.x - 30,
                top: position.y - 10,
              }}
              title={metric.description}
            >
              <span className="spider-chart-label-text">{metric.label}</span>
              <span className="spider-chart-label-value">{metric.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpiderChart;
