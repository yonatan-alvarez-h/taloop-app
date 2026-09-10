import React from "react";
import { Link } from "react-router-dom";
import type { Dataset } from "../../../../../types/dataset";
import "./DatasetOwner.css";

interface DatasetOwnerProps {
  owner: Dataset["owner"];
  ownerId?: string;
}

const DatasetOwner: React.FC<DatasetOwnerProps> = ({ owner, ownerId }) => {
  const content = (
    <>
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
          {owner.type === "empresa" || owner.type === "company" || owner.type === "org"
            ? "Empresa"
            : "Persona"}
        </span>
        {/* No mostrar website ni email en la Card ni detalles */}
        {owner.description && (
          <div className="dataset-owner__description">{owner.description}</div>
        )}
      </div>
    </>
  );

  return ownerId ? (
    <Link to={`/owners/${encodeURIComponent(ownerId)}`} className="dataset-owner dataset-owner--link">
      {content}
    </Link>
  ) : (
    <div className="dataset-owner">{content}</div>
  );
};

export default DatasetOwner;
