import React, { useId, useMemo, useState } from "react";
import "./FacetFilter.css";

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

interface FacetFilterProps {
  label: string;
  options: FacetOption[];
  selected: string[];
  onToggle: (value: string) => void;
  searchable?: boolean;
}

const INITIAL_OPTIONS = 5;

const normalizeSearch = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

const FacetFilter: React.FC<FacetFilterProps> = ({
  label,
  options,
  selected,
  onToggle,
  searchable = false,
}) => {
  const searchId = useId();
  const optionsId = useId();
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const canSearch = searchable && (options.length > 6 || Boolean(query));
  const normalizedQuery = canSearch ? normalizeSearch(query.trim()) : "";

  const matchingOptions = useMemo(
    () =>
      options.filter((option) =>
        normalizeSearch(option.label).includes(normalizedQuery)
      ),
    [normalizedQuery, options]
  );
  const selectedOptions = useMemo(
    () => options.filter((option) => selected.includes(option.value)),
    [options, selected]
  );
  const matchingUnselected = useMemo(
    () =>
      matchingOptions.filter((option) => !selected.includes(option.value)),
    [matchingOptions, selected]
  );
  const matchingSelected = useMemo(
    () =>
      matchingOptions.filter((option) => selected.includes(option.value)),
    [matchingOptions, selected]
  );
  const selectedOutsideSearch = useMemo(
    () => {
      const matchingValues = new Set(
        matchingOptions.map((option) => option.value)
      );
      return selectedOptions.filter(
        (option) => !matchingValues.has(option.value)
      );
    },
    [matchingOptions, selectedOptions]
  );
  const orderedOptions = useMemo(
    () => [
      ...matchingSelected,
      ...matchingUnselected,
      ...selectedOutsideSearch,
    ],
    [matchingSelected, matchingUnselected, selectedOutsideSearch]
  );
  const visibleOptions = useMemo(
    () =>
      showAll ? orderedOptions : orderedOptions.slice(0, INITIAL_OPTIONS),
    [orderedOptions, showAll]
  );
  const hiddenCount = Math.max(0, orderedOptions.length - INITIAL_OPTIONS);

  if (!options.length) return null;

  return (
    <fieldset className="dataset-list__filter-group">
      <legend>
        {label}
        {selectedOptions.length > 0 && (
          <span className="dataset-list__facet-selected-count">
            {selectedOptions.length} selec.
          </span>
        )}
      </legend>
      {canSearch && (
        <div className="dataset-list__facet-search">
          <label
            className="dataset-list__facet-visually-hidden"
            htmlFor={searchId}
          >
            Buscar en {label.toLocaleLowerCase()}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShowAll(false);
            }}
            placeholder={`Buscar ${label.toLocaleLowerCase()}`}
            autoComplete="off"
          />
        </div>
      )}
      <div id={optionsId} className="dataset-list__facet-options">
        {visibleOptions.map((option) => (
          <label className="dataset-list__facet-option" key={option.value}>
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            <span>{option.label}</span>
            <small>{option.count}</small>
          </label>
        ))}
        {!matchingOptions.length && normalizedQuery && (
          <p className="dataset-list__facet-empty" role="status">
            Sin coincidencias para “{query.trim()}”
          </p>
        )}
      </div>
      {hiddenCount > 0 && (
        <button
          type="button"
          className="dataset-list__facet-toggle"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
          aria-controls={optionsId}
        >
          {showAll ? "Mostrar menos" : `Mostrar ${hiddenCount} más`}
        </button>
      )}
    </fieldset>
  );
};

export default FacetFilter;
