import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="d-flex" onSubmit={handleSubmit} style={{ width: "100%" }}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Buscar..."
        aria-label="Buscar"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button className="btn btn-outline-success" type="submit">
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;
