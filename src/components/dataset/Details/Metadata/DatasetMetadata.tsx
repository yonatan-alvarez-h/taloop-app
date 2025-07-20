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
      <li>
        <strong>Descripción:</strong> {dataset.description}
        {dataset.category && <DatasetCategory category={dataset.category} />}
      </li>

      <strong>Metadata:</strong>
      <ul>
        <li className="uid-row">
          <b>UID:</b> <DatasetUID uid={dataset.uid} />
        </li>
        <li className="metadata-section">
          <b>Título:</b> {dataset.title}
        </li>
        <li className="metadata-section">
          <b>Propietario:</b> <DatasetOwner owner={dataset.owner} />
        </li>
        <li className="align-start metadata-section">
          <b>Etiquetas:</b>
          <span>
            {dataset.tags.map((tag: string) => (
              <span className="dataset-tags-chip" key={tag}>
                {tag}
              </span>
            ))}
          </span>
        </li>
        <li className="align-start metadata-section">
          <b>Campos:</b> <DatasetFields fields={dataset.fields} />
        </li>

        {/* Nuevas características de metadata */}
        {dataset.timestamps && (
          <li className="metadata-section">
            <b>Fechas:</b>
            <DatasetTimestamps
              createdAt={dataset.timestamps.createdAt}
              updatedAt={dataset.timestamps.updatedAt}
            />
          </li>
        )}

        {dataset.size && (
          <li className="metadata-section">
            <b>Tamaño:</b>
            <DatasetSize
              fileSize={dataset.size.fileSize}
              recordCount={dataset.size.recordCount}
              columnCount={dataset.size.columnCount}
            />
          </li>
        )}

        {dataset.format && (
          <li className="metadata-section">
            <b>Formato:</b>
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
            <b>Estadísticas de uso:</b>
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
            <b>Industria y dominio:</b>
            <DatasetDomain
              industry={dataset.domain.industry}
              subDomain={dataset.domain.subDomain}
              applications={dataset.domain.applications}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

export default DatasetMetadata;
