import React from "react";
import type { Dataset } from "../../../../types/dataset";

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
        <b>Campos:</b>
        <span>
          {dataset.fields.map((field: string) => (
            <span className="dataset-fields-chip" key={field}>
              {field}
            </span>
          ))}
        </span>
      </li>
      <li>
        <b>Descripción:</b> {dataset.description}
      </li>
      <li>
        <b>Propietario:</b> {dataset.owner.name}
      </li>
      <li>
        <b>Precio:</b> {dataset.priceUsd} USD
      </li>
    </ul>
  </div>
);

export default DatasetMetadata;
