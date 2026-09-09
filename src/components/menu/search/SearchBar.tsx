import React, { useState } from "react";
import Button from "../../UI/Button";
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
      <div className="search-bar-field">
        <input
          className="search-bar-input"
          type="search"
          placeholder="Explora datos, escribe tu búsqueda..."
          aria-label="Buscar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          size="md"
          className="search-bar-btn"
          aria-label="Buscar"
          title="Buscar"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
