import React from "react";
import type { Dataset } from "../../types/dataset";

interface DatasetOwnerProps {
  owner: Dataset["owner"];
}

const DatasetOwner: React.FC<DatasetOwnerProps> = ({ owner }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    {owner.logoUrl && (
      <img
        src={owner.logoUrl}
        alt={owner.name}
        style={{
          width: 32,
          height: 32,
          objectFit: "cover",
          borderRadius: "50%",
          border: "2px solid #fff",
          boxShadow: "0 2px 8px rgba(13,138,188,0.10)",
        }}
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
      {owner.website && (
        <div>
          <a
            href={owner.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0D8ABC",
              fontSize: "0.9em",
              textDecoration: "underline",
            }}
          >
            {owner.website}
          </a>
        </div>
      )}
      {owner.email && (
        <div style={{ color: "#888", fontSize: "0.9em" }}>{owner.email}</div>
      )}
      {owner.description && (
        <div style={{ color: "#666", fontSize: "0.9em" }}>
          {owner.description}
        </div>
      )}
    </div>
  </div>
);

export default DatasetOwner;
