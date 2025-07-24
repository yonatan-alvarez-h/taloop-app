import React from "react";

interface NoResultsProps {
  searchTerm: string;
}

const NoResults: React.FC<NoResultsProps> = ({ searchTerm }) => {
  return (
    <div className="fields-no-results">
      No se encontraron columnas que coincidan con "{searchTerm}"
    </div>
  );
};

export default NoResults;
