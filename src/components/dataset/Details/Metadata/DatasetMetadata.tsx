import React from "react";
import type { Dataset } from "../../../../types/dataset";
import DatasetOwner from "../../Owner/DatasetOwner";
import DatasetFields from "../../Fields/DatasetFields";

interface DatasetMetadataProps {
  dataset: Dataset;
}

const DatasetMetadata: React.FC<DatasetMetadataProps> = ({ dataset }) => (
  <div className="dataset-preview-meta">
    <strong>Metadata:</strong>
    <ul>
      <li>
        <b>ID:</b> {dataset.id}
      </li>
      <li>
        <b>Título:</b> {dataset.title}
      </li>
      <li>
        <b>Propietario:</b> <DatasetOwner owner={dataset.owner} />
      </li>
      <li style={{ alignItems: "flex-start" }}>
        <b>Etiquetas:</b>
        <span>
          {dataset.tags.map((tag: string) => (
            <span className="dataset-tags-chip" key={tag}>
              {tag}
            </span>
          ))}
        </span>
      </li>
      <li style={{ alignItems: "flex-start" }}>
        <b>Campos:</b> <DatasetFields fields={dataset.fields} />
      </li>
      <li>
        <b>Descripción:</b> {dataset.description}
      </li>
    </ul>
  </div>
);

export default DatasetMetadata;
