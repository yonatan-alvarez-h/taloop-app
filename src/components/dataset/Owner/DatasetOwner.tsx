import React from "react";
import type { Dataset } from "../../../types/dataset";
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
    <div style={{ lineHeight: 1.2 }}>
      <span style={{ fontWeight: 600, fontSize: "1em" }}>{owner.name}</span>
      <span
        style={{
          fontSize: "0.8em",
          marginLeft: 6,
          padding: "2px 8px",
          background: "#e3f2fd",
          color: "#1976d2",
          borderRadius: 4,
        }}
      >
        {owner.type === "empresa" ? "Empresa" : "Usuario"}
      </span>
      {/* No mostrar website ni email en la Card ni detalles */}
      {owner.description && (
        <div className="owner-description">{owner.description}</div>
      )}
    </div>
  </div>
);

export default DatasetOwner;
