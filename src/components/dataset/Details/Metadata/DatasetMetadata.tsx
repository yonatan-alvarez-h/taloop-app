import React from "react";
import type { Dataset } from "../../../../types/dataset";
import DatasetCategory from "../../Category/DatasetCategory";
import DatasetOwner from "../../Owner/DatasetOwner";
import DatasetFields from "../../Fields/DatasetFields";
import "./DatasetMetadata.css";

interface DatasetMetadataProps {
  dataset: Dataset;
}

const DatasetMetadata: React.FC<DatasetMetadataProps> = ({ dataset }) => (
  <div className="dataset-preview-meta">
    <li>
      <strong>Descripción:</strong> {dataset.description}
      {dataset.category && <DatasetCategory category={dataset.category} />}
    </li>

    <strong>Metadata:</strong>
    <ul>
      <li>
        <b>UID:</b> {dataset.uid}
      </li>
      <li>
        <b>Título:</b> {dataset.title}
      </li>
      <li>
        <b>Propietario:</b> <DatasetOwner owner={dataset.owner} />
      </li>
      <li className="align-start">
        <b>Etiquetas:</b>
        <span>
          {dataset.tags.map((tag: string) => (
            <span className="dataset-tags-chip" key={tag}>
              {tag}
            </span>
          ))}
        </span>
      </li>
      <li className="align-start">
        <b>Campos:</b> <DatasetFields fields={dataset.fields} />
      </li>
    </ul>
  </div>
);

export default DatasetMetadata;
