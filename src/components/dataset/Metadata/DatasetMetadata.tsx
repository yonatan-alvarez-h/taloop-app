import React from "react";
import type { Dataset } from "../../../types/dataset";
import {
  DatasetCategory,
  DatasetOwner,
  DatasetUID,
  DatasetDomain,
} from "./Basic";
import { DatasetFields, DatasetFormat, DatasetSize } from "./Technical";
import { DatasetTimestamps, DatasetUsage } from "./Temporal";
import "./DatasetMetadata.css";

interface DatasetMetadataProps {
  dataset: Dataset;
}

const DatasetMetadata: React.FC<DatasetMetadataProps> = ({ dataset }) => {
  return (
    <ul className="dataset-preview-meta">
      {/* Header con UID, Título y Descripción */}
      <li className="metadata-header">
        <div className="header-info">
          <div className="uid-title-group">
            <div className="title-line">
              <strong>Título:</strong>
              <span>{dataset.title}</span>
            </div>
            <div className="uid-line">
              <strong>UID:</strong>
              <DatasetUID uid={dataset.uid} />
            </div>
          </div>
          <div className="description-group">
            <strong>Descripción:</strong>
            <p>{dataset.description}</p>
          </div>
        </div>
      </li>

      {/* Etiquetas */}
      <li className="align-start metadata-section">
        <strong>Etiquetas:</strong>
        <div className="tags-container">
          {dataset.tags.map((tag: string) => (
            <span className="dataset-tags-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </li>

      {/* Propietario */}
      <li className="metadata-section">
        <strong>Propietario:</strong>
        <DatasetOwner owner={dataset.owner} />
      </li>

      {/* Categoría */}
      {dataset.category && (
        <li className="metadata-section">
          <strong>Categoría:</strong>
          <DatasetCategory category={dataset.category} />
        </li>
      )}

      {/* Dominio */}
      {dataset.domain && (
        <li className="metadata-section">
          <strong>Dominio:</strong>
          <DatasetDomain
            industry={dataset.domain.industry}
            subDomain={dataset.domain.subDomain}
          />
        </li>
      )}

      {/* Columnas */}
      <li className="align-start metadata-section">
        <strong>Columnas ({dataset.fields.length}):</strong>
        <DatasetFields fields={dataset.fields} showDetails={true} />
      </li>

      {/* Tamaño */}
      {dataset.size && (
        <li className="metadata-section">
          <strong>Tamaño:</strong>
          <DatasetSize
            fileSize={dataset.size.fileSize}
            recordCount={dataset.size.recordCount}
            columnCount={dataset.size.columnCount}
          />
        </li>
      )}

      {/* Formato */}
      {dataset.format && (
        <li className="metadata-section">
          <strong>Formato:</strong>
          <DatasetFormat
            type={dataset.format.type}
            encoding={dataset.format.encoding}
            delimiter={dataset.format.delimiter}
            compression={dataset.format.compression}
          />
        </li>
      )}

      {/* Fechas */}
      {dataset.timestamps && (
        <li className="metadata-section">
          <strong>Fechas:</strong>
          <DatasetTimestamps
            createdAt={dataset.timestamps.createdAt}
            updatedAt={dataset.timestamps.updatedAt}
          />
        </li>
      )}

      {/* Estadísticas de Uso */}
      {dataset.usage && (
        <li className="metadata-section">
          <strong>Estadísticas de Uso:</strong>
          <DatasetUsage
            downloads={dataset.usage.downloads}
            views={dataset.usage.views}
            apiCalls={dataset.usage.apiCalls}
            lastAccessed={dataset.usage.lastAccessed}
          />
        </li>
      )}
    </ul>
  );
};

export default DatasetMetadata;
