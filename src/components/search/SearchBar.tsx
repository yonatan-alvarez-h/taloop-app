import React, { useState } from "react";
import "./SearchBar.css";

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
    <form className="search-bar-form" onSubmit={handleSubmit}>
      <input
        className="search-bar-input"
        type="search"
        placeholder="Buscar..."
        aria-label="Buscar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-bar-btn" type="submit">
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;
