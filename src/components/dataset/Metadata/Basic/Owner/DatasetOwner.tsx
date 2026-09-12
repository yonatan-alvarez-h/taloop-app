import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Dataset } from "../../../../../types/dataset";
import "./DatasetOwner.css";

interface DatasetOwnerProps {
  owner: Dataset["owner"];
  ownerId?: string;
  variant?: "default" | "compact";
}

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials || "?";
};

const DatasetOwner: React.FC<DatasetOwnerProps> = ({
  owner,
  ownerId,
  variant = "default",
}) => {
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);
  const showLogo = Boolean(
    owner.logoUrl && failedLogoUrl !== owner.logoUrl
  );
  const ownerType =
    owner.type === "empresa" || owner.type === "company" || owner.type === "org"
      ? "Empresa"
      : "Persona";
  const content = (
    <>
      {showLogo && (
        <img
          src={owner.logoUrl}
          alt=""
          className="dataset-owner-logo"
          onError={() => setFailedLogoUrl(owner.logoUrl || null)}
        />
      )}
      {!showLogo && (
        <span className="dataset-owner__avatar" aria-hidden="true">
          {getInitials(owner.name)}
        </span>
      )}
      <div className="dataset-owner__info">
        <span className="dataset-owner__name">{owner.name}</span>
        <span className="dataset-owner__type"> · {ownerType}</span>
        {/* No mostrar website ni email en la Card ni detalles */}
        {owner.description && (
          <div className="dataset-owner__description">{owner.description}</div>
        )}
      </div>
    </>
  );

  return ownerId ? (
    <Link
      to={`/owners/${encodeURIComponent(ownerId)}`}
      className={`dataset-owner dataset-owner--${variant} dataset-owner--link`}
    >
      {content}
    </Link>
  ) : (
    <div className={`dataset-owner dataset-owner--${variant}`}>{content}</div>
  );
};

export default DatasetOwner;
