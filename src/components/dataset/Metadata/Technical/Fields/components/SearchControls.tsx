import React from "react";

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalFields: number;
  filteredCount: number;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  searchTerm,
  onSearchChange,
  totalFields,
  filteredCount,
}) => {
  return (
    <div className="fields-controls">
      <div className="fields-search">
        <input
          type="text"
          placeholder="Buscar columnas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="fields-search-input"
        />
        <span className="fields-search-icon">🔍</span>
      </div>
      <div className="fields-summary">
        {filteredCount !== totalFields && (
          <span className="fields-filtered">
            {filteredCount} de {totalFields} columnas
          </span>
        )}
        {filteredCount === totalFields && (
          <span className="fields-total">
            {totalFields} columna{totalFields !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchControls;
