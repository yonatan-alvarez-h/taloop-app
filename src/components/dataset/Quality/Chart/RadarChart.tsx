import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import "./RadarChart.css";

// Registrar los componentes de Chart.js necesarios
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  metrics: Array<{
    key: string;
    label: string;
    value: number;
    description: string;
  }>;
}

const RadarChart: React.FC<RadarChartProps> = ({ metrics }) => {
  // Calcular el promedio para determinar el color
  const averageValue =
    metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;

  const getChartColor = (avg: number) => {
    if (avg >= 90)
      return {
        bg: "rgba(34, 197, 94, 0.2)",
        border: "rgb(34, 197, 94)",
        point: "rgb(34, 197, 94)",
      }; // Verde
    if (avg >= 80)
      return {
        bg: "rgba(132, 204, 22, 0.2)",
        border: "rgb(132, 204, 22)",
        point: "rgb(132, 204, 22)",
      }; // Verde claro
    if (avg >= 70)
      return {
        bg: "rgba(234, 179, 8, 0.2)",
        border: "rgb(234, 179, 8)",
        point: "rgb(234, 179, 8)",
      }; // Amarillo
    if (avg >= 60)
      return {
        bg: "rgba(249, 115, 22, 0.2)",
        border: "rgb(249, 115, 22)",
        point: "rgb(249, 115, 22)",
      }; // Naranja
    return {
      bg: "rgba(239, 68, 68, 0.2)",
      border: "rgb(239, 68, 68)",
      point: "rgb(239, 68, 68)",
    }; // Rojo
  };

  const colors = getChartColor(averageValue);

  const data = {
    labels: metrics.map((metric) => metric.label),
    datasets: [
      {
        label: "Calidad de Datos",
        data: metrics.map((metric) => metric.value),
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 2.5,
        pointBackgroundColor: colors.point,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.15,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 2.5,
      },
      point: {
        radius: 5,
        hoverRadius: 8,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            const index = context.dataIndex;
            const metric = metrics[index];
            return `${metric.label}: ${metric.value}% - ${metric.description}`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: colors.border,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        angleLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
          lineWidth: 1,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          lineWidth: 1,
          circular: true,
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 600 as const,
          },
          color: "#374151",
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 100,
          stepSize: 20,
          showLabelBackdrop: false,
          display: false, // Ocultar los labels de porcentajes
          color: "#6b7280",
          font: {
            size: 10,
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    interaction: {
      intersect: false,
      mode: "nearest" as const,
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart" as const,
    },
  };

  return (
    <div className="radar-chart-container">
      <div className="radar-chart-wrapper">
        <Radar data={data} options={options} />
      </div>

      {/* Información adicional */}
      <div className="radar-chart-info">
        <div className="radar-chart-average">
          <span className="radar-chart-average-label">Promedio General:</span>
          <span
            className="radar-chart-average-value"
            style={{ color: colors.border }}
          >
            {averageValue.toFixed(1)}%
          </span>
        </div>

        <div className="radar-chart-legend">
          {metrics.map((metric) => (
            <div key={metric.key} className="radar-chart-legend-item">
              <div
                className="radar-chart-legend-color"
                style={{ backgroundColor: colors.border }}
              />
              <span className="radar-chart-legend-text">
                {metric.label}: <strong>{metric.value}%</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
