import React from "react";
import type { Dataset } from "../../../../types/dataset";
import DatasetCategory from "../../Category/DatasetCategory";
import DatasetOwner from "../../Owner/DatasetOwner";
import DatasetFields from "../../Fields/DatasetFields";
import DatasetUID from "../../UID/DatasetUID";
import DatasetTimestamps from "../../Timestamps/DatasetTimestamps";
import DatasetSize from "../../Size/DatasetSize";
import DatasetFormat from "../../Format/DatasetFormat";
import DatasetUsage from "../../Usage/DatasetUsage";
import DatasetDomain from "../../Domain/DatasetDomain";
import "./DatasetMetadata.css";

interface DatasetMetadataProps {
  dataset: Dataset;
}

const DatasetMetadata: React.FC<DatasetMetadataProps> = ({ dataset }) => {
  return (
    <div className="dataset-preview-meta">
      <strong>Descripción:</strong>
      <li>
        {dataset.description}
        {dataset.category && <DatasetCategory category={dataset.category} />}
      </li>

      <strong>Metadatos:</strong>
      <ul>
        <li className="uid-row">
          <strong>UID:</strong> <DatasetUID uid={dataset.uid} />
        </li>
        <li className="metadata-section">
          <strong>Título:</strong> {dataset.title}
        </li>
        <li className="metadata-section">
          <strong>Propietario:</strong> <DatasetOwner owner={dataset.owner} />
        </li>
        <li className="align-start metadata-section">
          <strong>Etiquetas:</strong>
          <span>
            {dataset.tags.map((tag: string) => (
              <span className="dataset-tags-chip" key={tag}>
                {tag}
              </span>
            ))}
          </span>
        </li>
        <li className="align-start metadata-section">
          <strong>Campos:</strong> <DatasetFields fields={dataset.fields} />
        </li>

        {/* Nuevas características de metadata */}
        {dataset.timestamps && (
          <li className="metadata-section">
            <strong>Fechas:</strong>
            <DatasetTimestamps
              createdAt={dataset.timestamps.createdAt}
              updatedAt={dataset.timestamps.updatedAt}
            />
          </li>
        )}

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

        {dataset.usage && (
          <li className="metadata-section">
            <strong>Uso:</strong>
            <DatasetUsage
              downloads={dataset.usage.downloads}
              views={dataset.usage.views}
              apiCalls={dataset.usage.apiCalls}
              lastAccessed={dataset.usage.lastAccessed}
            />
          </li>
        )}

        {dataset.domain && (
          <li className="metadata-section">
            <strong>Dominio:</strong>
            <DatasetDomain
              industry={dataset.domain.industry}
              subDomain={dataset.domain.subDomain}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

export default DatasetMetadata;
