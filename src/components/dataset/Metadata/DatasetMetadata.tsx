import React from "react";
import type { Dataset } from "../../../types/dataset";
import { DatasetOwner, DatasetID } from "./Basic";
import { DatasetFields } from "./Technical";
import "./DatasetMetadata.css";

interface DatasetMetadataProps {
  dataset: Dataset;
}

const DatasetMetadata: React.FC<DatasetMetadataProps> = ({ dataset }) => {
  const qualityScore = dataset.dataQuality
    ? Math.round(dataset.dataQuality.overallScore * 10)
    : null;

  return (
    <div className="dataset-metadata">
      <section className="dataset-metadata-schema" aria-labelledby="schema-title">
        <div className="dataset-metadata-heading">
          <div>
            <h2 id="schema-title">Esquema</h2>
            <p>{dataset.fields.length} columnas disponibles</p>
          </div>
          <span className="dataset-metadata-hint">6 visibles por página</span>
        </div>
        <DatasetFields fields={dataset.fields} showDetails itemsPerPage={6} compact />
      </section>

      <aside className="dataset-metadata-context" aria-label="Contexto del dataset">
        {qualityScore !== null && (
          <div className="dataset-context-item dataset-context-quality">
            <span className="dataset-context-label">Calidad validada</span>
            <div className="dataset-context-quality-row">
              <strong>{qualityScore}%</strong>
              <span>
                {dataset.dataQuality?.validationMethod === "automated"
                  ? "Automatizada"
                  : dataset.dataQuality?.validationMethod === "manual"
                    ? "Manual"
                    : "Híbrida"}
              </span>
            </div>
          </div>
        )}

        <div className="dataset-context-item">
          <span className="dataset-context-label">Publicado por</span>
          <DatasetOwner owner={dataset.owner} />
        </div>

        <div className="dataset-context-item dataset-context-reference">
          <span className="dataset-context-label">Referencia</span>
          <DatasetID _id={dataset._id} />
        </div>

        {dataset.usage && (
          <dl className="dataset-context-usage">
            <div>
              <dt>Descargas</dt>
              <dd>{dataset.usage.downloads.toLocaleString("es-ES")}</dd>
            </div>
            <div>
              <dt>Vistas</dt>
              <dd>{dataset.usage.views.toLocaleString("es-ES")}</dd>
            </div>
            <div>
              <dt>Llamadas API</dt>
              <dd>{dataset.usage.apiCalls.toLocaleString("es-ES")}</dd>
            </div>
          </dl>
        )}

        {dataset.tags.length > 3 && (
          <div className="dataset-context-item">
            <span className="dataset-context-label">Todas las etiquetas</span>
            <div className="dataset-context-tags">
              {dataset.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default DatasetMetadata;
