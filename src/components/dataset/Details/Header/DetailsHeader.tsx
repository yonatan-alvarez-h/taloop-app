import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Dataset } from "../../../../types/dataset";
import DatasetRating from "../../Rating";
import DatasetPrice from "../../Price";
import DatasetCategory from "../../Metadata/Basic/Category";
import "./DetailsHeader.css";

interface DetailsHeaderProps {
  dataset: Dataset;
}

const DetailsHeader: React.FC<DetailsHeaderProps> = ({ dataset }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const formatNumber = (value: number) =>
    value >= 1000000
      ? `${(value / 1000000).toFixed(1)} M`
      : value >= 1000
        ? `${(value / 1000).toFixed(1)} K`
        : value.toLocaleString("es-ES");

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const compactDatasetId =
    dataset._id.length > 14
      ? `${dataset._id.slice(0, 8)}…${dataset._id.slice(-5)}`
      : dataset._id;

  const metrics = [
    dataset.size && {
      label: "Registros",
      value: formatNumber(dataset.size.recordCount),
    },
    {
      label: "Columnas",
      value: dataset.size?.columnCount ?? dataset.fields.length,
    },
    dataset.size && { label: "Tamaño", value: dataset.size.fileSize },
    dataset.format && {
      label: "Formato",
      value: [dataset.format.type, dataset.format.encoding]
        .filter(Boolean)
        .join(" · "),
    },
    dataset.timestamps?.updatedAt && {
      label: "Actualizado",
      value: formatDate(dataset.timestamps.updatedAt),
    },
  ].filter(Boolean) as Array<{ label: string; value: string | number }>;

  return (
    <div
      className={`details-header${
        isDescriptionExpanded ? " details-header--description-expanded" : ""
      }`}
    >
      <nav className="details-header-breadcrumb" aria-label="Ubicación actual">
        <Link to="/">Explorar datasets</Link>
        <span aria-hidden="true">›</span>
        <span>{dataset.category ?? "General"}</span>
        <span aria-hidden="true">›</span>
        <span aria-current="page" aria-label={`ID del dataset ${dataset._id}`}>
          ID {compactDatasetId}
        </span>
      </nav>

      <div className="details-header-main">
        <div className="details-header-identity">
          <div className="details-header-title-row">
            <h1 className="details-header-title">{dataset.title}</h1>
            {dataset.category && <DatasetCategory category={dataset.category} />}
          </div>

          {dataset.tags.length > 0 && (
            <div className="details-header-tags" aria-label="Etiquetas">
              {dataset.tags.slice(0, 3).map((tag) => (
                <span className="details-header-tag" key={tag}>
                  {tag}
                </span>
              ))}
              {dataset.tags.length > 3 && (
                <span className="details-header-tag">
                  +{dataset.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="details-header-description">
            <p>{dataset.description}</p>
          </div>

          {!isDescriptionExpanded && (
            <button
              className="details-header-description-toggle"
              type="button"
              aria-expanded={false}
              aria-controls="dataset-full-description"
              onClick={() => setIsDescriptionExpanded(true)}
            >
              Ver descripción completa
            </button>
          )}

        </div>

        <div className="details-header-purchase">
          <DatasetPrice price={dataset.priceUsd} currency="USD" />
          {typeof dataset.rating === "number" && (
            <DatasetRating
              rating={dataset.rating}
              ratingCount={dataset.ratingCount}
              size="small"
              variant="compact"
            />
          )}
        </div>
      </div>

      <div
        className="details-header-full-description"
        id="dataset-full-description"
        hidden={!isDescriptionExpanded}
      >
        <p>{dataset.description}</p>
        <button
          className="details-header-description-toggle"
          type="button"
          aria-expanded={true}
          aria-controls="dataset-full-description"
          onClick={() => setIsDescriptionExpanded(false)}
        >
          Ocultar descripción
        </button>
      </div>

      {metrics.length > 0 && (
        <dl className="details-header-metrics">
          {metrics.map((metric) => (
            <div className="details-header-metric" key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};

export default DetailsHeader;
