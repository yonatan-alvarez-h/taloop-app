import React from "react";
import type { Dataset } from "../../../types/dataset";
import { DatasetCategory, DatasetOwner, DatasetID } from "./Basic";
import { DatasetFields, DatasetFormat, DatasetSize } from "./Technical";
import { DatasetTimestamps, DatasetUsage } from "./Temporal";
import "./DatasetMetadata.css";

interface DatasetMetadataProps {
  dataset: Dataset;
}

const DatasetMetadata: React.FC<DatasetMetadataProps> = ({ dataset }) => {
  return (
    <ul className="dataset-preview-meta">
      {/* Fechas */}
      {dataset.timestamps && (
        <li className="metadata-section">
          <DatasetTimestamps
            createdAt={dataset.timestamps.createdAt}
            updatedAt={dataset.timestamps.updatedAt}
          />
        </li>
      )}

      {/* id, Propietario y Categoría en línea */}
      <li className="metadata-section">
        <div className="header-info">
          <div className="metadata-inline-item id-container-wrapper">
            <div className="metadata-item--inline">
              <strong>ID:</strong>
              <DatasetID _id={dataset._id} />
            </div>
          </div>
          <div className="metadata-inline-item">
            <div className="metadata-item--inline">
              <strong>Propietario:</strong>
              <DatasetOwner owner={dataset.owner} />
            </div>
          </div>
          <div className="metadata-inline-item">
            <div className="metadata-item--inline">
              <strong>Categoría:</strong>
              {dataset.category && (
                <DatasetCategory category={dataset.category} />
              )}
            </div>
          </div>
        </div>
      </li>

      {/* Etiquetas */}
      <li className="metadata-section">
        <div className="metadata-item--inline">
          <strong>Etiquetas:</strong>
          <div className="tags-container">
            {dataset.tags.map((tag: string) => (
              <span className="dataset-tags-chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </li>

      {/* Línea divisora */}
      <li className="metadata-divider">
        <hr />
      </li>

      {/* Columnas */}
      <li className="align-start metadata-section">
        <strong>Columnas ({dataset.fields.length}):</strong>
        <DatasetFields fields={dataset.fields} showDetails={true} />
      </li>

      {/* Línea divisora */}
      <li className="metadata-divider">
        <hr />
      </li>

      {/* Estadísticas de Uso y Tamaño en línea (50%-50%) */}
      {(dataset.usage || dataset.size) && (
        <li className="metadata-section">
          <div className="usage-size-info">
            {dataset.usage && (
              <div className="metadata-inline-item">
                <strong>Estadísticas de Uso:</strong>
                <DatasetUsage
                  downloads={dataset.usage.downloads}
                  views={dataset.usage.views}
                  apiCalls={dataset.usage.apiCalls}
                />
              </div>
            )}
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
          </div>
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
    </ul>
  );
};

export default DatasetMetadata;
