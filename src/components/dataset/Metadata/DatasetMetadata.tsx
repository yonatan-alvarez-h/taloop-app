import React from "react";
import type { Dataset } from "../../../types/dataset";
import { DatasetCategory, DatasetOwner, DatasetUID } from "./Basic";
import { DatasetFields, DatasetFormat, DatasetSize } from "./Technical";
import { DatasetTimestamps, DatasetUsage } from "./Temporal";
import "./DatasetMetadata.css";

interface DatasetMetadataProps {
  dataset: Dataset;
}

const DatasetMetadata: React.FC<DatasetMetadataProps> = ({ dataset }) => {
  return (
    <ul className="dataset-preview-meta">
      {/* UID, Propietario y Categoría en línea */}
      <li className="metadata-section">
        <div className="header-info">
          <div className="metadata-inline-item">
            <div className="metadata-item--inline">
              <strong>UID:</strong>
              <DatasetUID uid={dataset.uid} />
            </div>
          </div>
          <div className="metadata-inline-item">
            <div className="metadata-item--inline">
              <strong>Propietario:</strong>
              <DatasetOwner owner={dataset.owner} />
            </div>
          </div>
          <div className="metadata-inline-item">
            <strong>Categoría:</strong>
            {dataset.category && (
              <DatasetCategory category={dataset.category} />
            )}
          </div>
        </div>
      </li>

      {/* Etiquetas */}
      <li className="metadata-section">
        <strong>Etiquetas:</strong>
        <div className="tags-container">
          {dataset.tags.map((tag: string) => (
            <span className="dataset-tags-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </li>

      {/* Columnas */}
      <li className="align-start metadata-section">
        <strong>Columnas ({dataset.fields.length}):</strong>
        <DatasetFields fields={dataset.fields} showDetails={true} />
      </li>

      {/* Tamaño y Formato en línea */}
      {(dataset.size || dataset.format) && (
        <li className="metadata-section">
          <div className="size-format-info">
            {dataset.size && (
              <div className="metadata-inline-item">
                <strong>Tamaño:</strong>
                <DatasetSize
                  fileSize={dataset.size.fileSize}
                  recordCount={dataset.size.recordCount}
                  columnCount={dataset.size.columnCount}
                />
              </div>
            )}
            {dataset.format && (
              <div className="metadata-inline-item">
                <strong>Formato:</strong>
                <DatasetFormat
                  type={dataset.format.type}
                  encoding={dataset.format.encoding}
                  delimiter={dataset.format.delimiter}
                  compression={dataset.format.compression}
                />
              </div>
            )}
          </div>
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
