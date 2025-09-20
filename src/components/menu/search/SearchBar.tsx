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
        variant="primary"
        size="md"
        className="search-bar-btn"
      >
        Buscar
      </Button>
    </form>
  );
};

export default SearchBar;
