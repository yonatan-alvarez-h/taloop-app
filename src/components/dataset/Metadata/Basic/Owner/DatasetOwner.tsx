import React from "react";
import type { Dataset } from "../../../../../types/dataset";
import "./DatasetOwner.css";

interface DatasetOwnerProps {
  owner: Dataset["owner"];
}

const DatasetOwner: React.FC<DatasetOwnerProps> = ({ owner }) => (
  <div className="dataset-owner">
    {owner.logoUrl && (
      <img
        src={owner.logoUrl}
        alt={owner.name}
        className="dataset-owner-logo"
      />
    )}
    <div className="dataset-owner__info">
      <span className="dataset-owner__name">{owner.name}</span>
      <span className="dataset-owner__type">
        {owner.type === "empresa" ? "Empresa" : "Usuario"}
      </span>
      {/* No mostrar website ni email en la Card ni detalles */}
      {owner.description && (
        <div className="dataset-owner__description">{owner.description}</div>
      )}
    </div>
  </div>
);

export default DatasetOwner;
