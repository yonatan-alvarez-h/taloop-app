import React, { useEffect, useMemo, useState } from "react";
import DatasetGrid from "../Grid";
import type { Dataset } from "../../../types/dataset";
import "./DatasetList.css";

interface DatasetListProps {
  datasets: Dataset[];
  search: string;
  onSearch?: (query: string) => void;
}

type SortOption = "relevance" | "quality" | "rating" | "price";
type PriceFilter = "zero" | "paid";
type QualityFilter = "excellent" | "very-good" | "good" | "regular" | "low";

const qualityLevels: {
  value: QualityFilter;
  label: string;
  minimum: number;
}[] = [
  { value: "excellent", label: "Excelente", minimum: 90 },
  { value: "very-good", label: "Muy buena", minimum: 80 },
  { value: "good", label: "Buena", minimum: 70 },
  { value: "regular", label: "Regular", minimum: 60 },
  { value: "low", label: "Baja", minimum: 0 },
];

const score = (dataset: Dataset) => {
  if (!dataset.dataQuality) return undefined;
  const quality = dataset.dataQuality;
  return Math.round(
    (quality.completeness + quality.accuracy + quality.consistency +
      quality.validity + quality.timeliness + quality.uniqueness) / 6
  );
};

const value = (item?: string) => item?.trim().toLocaleLowerCase() || "";

const getQualityLevel = (quality?: number) =>
  qualityLevels.find((level) => quality !== undefined && quality >= level.minimum)
    ?.value;

const getTextOptions = (
  datasets: Dataset[],
  getLabel: (dataset: Dataset) => string | undefined,
  exclude?: string
) => {
  const found = new Map<
    string,
    { value: string; label: string; count: number }
  >();
  datasets.forEach((dataset) => {
    const label = getLabel(dataset)?.trim();
    const normalized = value(label);
    if (!label || !normalized || normalized === exclude) return;
    const current = found.get(normalized);
    found.set(normalized, {
      value: normalized,
      label: current?.label || label,
      count: (current?.count || 0) + 1,
    });
  });
  return [...found.values()].sort((a, b) => a.label.localeCompare(b.label, "es"));
};

const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  search,
  onSearch = () => {},
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [owners, setOwners] = useState<string[]>([]);
  const [prices, setPrices] = useState<PriceFilter[]>([]);
  const [qualities, setQualities] = useState<QualityFilter[]>([]);
  const [sort, setSort] = useState<SortOption>(search ? "relevance" : "quality");

  const categoryOptions = useMemo(
    () => getTextOptions(datasets, (dataset) => dataset.category),
    [datasets]
  );
  const ownerOptions = useMemo(
    () =>
      getTextOptions(
        datasets,
        (dataset) => dataset.owner?.name,
        "proveedor no disponible"
      ),
    [datasets]
  );
  const qualityOptions = useMemo(() => {
    const counts = new Map<QualityFilter, number>();
    datasets.forEach((dataset) => {
      const level = getQualityLevel(score(dataset));
      if (level) {
        counts.set(level, (counts.get(level) || 0) + 1);
      }
    });
    return qualityLevels
      .filter((level) => counts.has(level.value))
      .map((level) => ({
        value: level.value,
        label: level.label,
        count: counts.get(level.value) || 0,
      }));
  }, [datasets]);
  const priceOptions = useMemo(() => {
    const zero = datasets.filter((dataset) => dataset.priceUsd === 0).length;
    const paid = datasets.filter((dataset) => dataset.priceUsd > 0).length;
    return [
      ...(zero
        ? [{ value: "zero" as PriceFilter, label: "$0", count: zero }]
        : []),
      ...(paid
        ? [
            {
              value: "paid" as PriceFilter,
              label: "Más de $0",
              count: paid,
            },
          ]
        : []),
    ];
  }, [datasets]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return datasets.filter((dataset) => {
      const searchable = [
        dataset.title,
        dataset.description,
        dataset.category,
        dataset.owner?.name,
        dataset.owner?.description,
        ...dataset.tags,
        ...dataset.fields.flatMap((field) => [
          field.name,
          field.description,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      const quality = getQualityLevel(score(dataset));
      const price: PriceFilter = dataset.priceUsd === 0 ? "zero" : "paid";
      return (
        (!query || searchable.includes(query)) &&
        (!categories.length || categories.includes(value(dataset.category))) &&
        (!owners.length || owners.includes(value(dataset.owner?.name))) &&
        (!prices.length || prices.includes(price)) &&
        (!qualities.length || (quality !== undefined && qualities.includes(quality)))
      );
    });
  }, [categories, datasets, owners, prices, qualities, search]);

  const results = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (sort === "relevance") return 0;
        if (sort === "price") return a.priceUsd - b.priceUsd;
        const first = sort === "quality" ? score(a) : a.rating;
        const second = sort === "quality" ? score(b) : b.rating;
        if (first === undefined && second === undefined) return 0;
        if (first === undefined) return 1;
        if (second === undefined) return -1;
        return second - first;
      }),
    [filtered, sort]
  );

  useEffect(() => {
    setPage(1);
  }, [categories, owners, prices, qualities, search, sort, pageSize]);

  useEffect(() => {
    setSort(search ? "relevance" : "quality");
  }, [search]);

  const toggle = <T,>(
    item: T,
    selected: T[],
    setSelected: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setSelected(
      selected.includes(item)
        ? selected.filter((current) => current !== item)
        : [...selected, item]
    );
  };
  const totalPages = Math.ceil(results.length / pageSize);
  const currentPage = Math.min(page, totalPages || 1);
  const visible = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const selectedCount =
    categories.length + owners.length + prices.length + qualities.length;

  const renderGroup = <T extends string | number>(
    label: string,
    options: { value: T; label: string; count: number }[],
    selected: T[],
    setSelected: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (options.length === 0) return null;

    return (
      <fieldset className="dataset-list__filter-group">
        <legend>{label}</legend>
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => toggle(option.value, selected, setSelected)}
            />
            <span>{option.label}</span>
            <small>{option.count}</small>
          </label>
        ))}
      </fieldset>
    );
  };

  const clearFilters = () => {
    setCategories([]);
    setOwners([]);
    setPrices([]);
    setQualities([]);
  };

  if (!datasets.length) {
    return (
      <main className="dataset-list">
        <div className="dataset-list-no-results alert alert-info">
          <h1 className="no-results-title">
            No hay datasets públicos disponibles
          </h1>
          <p className="no-results-description">Vuelve a intentarlo más tarde.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dataset-list">
      <header className="dataset-list__heading">
        <div>
          <h1>Catálogo de datos</h1>
          <p>Explora datasets públicos para tus próximos proyectos.</p>
        </div>
        <button
          type="button"
          className="dataset-list__filter-toggle"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
        >
          Filtros{selectedCount ? ` (${selectedCount})` : ""}
        </button>
      </header>

      <div className="dataset-list__layout">
        <aside
          id="catalog-filters"
          className={`dataset-list__filters${
            filtersOpen ? " dataset-list__filters--open" : ""
          }`}
          aria-label="Filtros del catálogo"
        >
          <div className="dataset-list__filter-heading">
            <h2>Filtrar</h2>
            <button
              type="button"
              className="dataset-list__clear"
              onClick={clearFilters}
              disabled={!selectedCount}
            >
              Limpiar
            </button>
          </div>
          {renderGroup("Categoría", categoryOptions, categories, setCategories)}
          {renderGroup("Proveedor", ownerOptions, owners, setOwners)}
          {renderGroup("Precio", priceOptions, prices, setPrices)}
          {renderGroup("Calidad", qualityOptions, qualities, setQualities)}
        </aside>

        <div className="dataset-list__results">
          {(search || selectedCount > 0) && (
            <div
              className="dataset-list__chips"
              role="group"
              aria-label="Filtros activos"
            >
              {search && (
                <button
                  type="button"
                  className="dataset-list__chip"
                  aria-label={`Quitar filtro de búsqueda: ${search}`}
                  onClick={() => onSearch("")}
                >
                  Búsqueda: {search} <span aria-hidden="true">×</span>
                </button>
              )}
              {categories.map((item) => {
                const label = categoryOptions.find(
                  (option) => option.value === item
                )?.label;
                return (
                  <button
                    type="button"
                    key={item}
                    className="dataset-list__chip"
                    aria-label={`Quitar filtro de categoría: ${label}`}
                    onClick={() => toggle(item, categories, setCategories)}
                  >
                    {label} <span aria-hidden="true">×</span>
                  </button>
                );
              })}
              {owners.map((item) => {
                const label = ownerOptions.find(
                  (option) => option.value === item
                )?.label;
                return (
                  <button
                    type="button"
                    key={item}
                    className="dataset-list__chip"
                    aria-label={`Quitar filtro de proveedor: ${label}`}
                    onClick={() => toggle(item, owners, setOwners)}
                  >
                    {label} <span aria-hidden="true">×</span>
                  </button>
                );
              })}
              {prices.map((item) => {
                const label = priceOptions.find(
                  (option) => option.value === item
                )?.label;
                return (
                  <button
                    type="button"
                    key={item}
                    className="dataset-list__chip"
                    aria-label={`Quitar filtro de precio: ${label}`}
                    onClick={() => toggle(item, prices, setPrices)}
                  >
                    {label} <span aria-hidden="true">×</span>
                  </button>
                );
              })}
              {qualities.map((item) => {
                const label = qualityOptions.find(
                  (option) => option.value === item
                )?.label;
                return (
                  <button
                    type="button"
                    key={item}
                    className="dataset-list__chip"
                    aria-label={`Quitar filtro de calidad: ${label}`}
                    onClick={() => toggle(item, qualities, setQualities)}
                  >
                    Calidad: {label} <span aria-hidden="true">×</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="dataset-list__toolbar">
            <p aria-live="polite">
              {results.length}{" "}
              {results.length === 1 ? "resultado" : "resultados"}
              {search ? ` para «${search}»` : ""}
            </p>
            <label>
              Ordenar por
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
              >
                {search && <option value="relevance">Relevancia</option>}
                <option value="quality">Calidad</option>
                <option value="rating">Valoración</option>
                <option value="price">Precio: menor a mayor</option>
              </select>
            </label>
          </div>

          {!results.length ? (
            <div className="dataset-list-no-results alert alert-info">
              <h2 className="no-results-title">No encontramos datasets</h2>
              <p className="no-results-description">
                Prueba con otros términos o elimina algunos filtros.
              </p>
            </div>
          ) : (
            <>
              <DatasetGrid datasets={visible} />
              <footer className="dataset-list__pagination">
                {results.length > pageSize && (
                  <label>
                    Resultados por página
                    <select
                      value={pageSize}
                      onChange={(event) =>
                        setPageSize(Number(event.target.value))
                      }
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                  </label>
                )}
                {totalPages > 1 && (
                  <nav
                    className="dataset-list__pager"
                    aria-label="Paginación de resultados"
                  >
                    <button
                      type="button"
                      className="dataset-list__page-button"
                      disabled={currentPage === 1}
                      onClick={() => setPage(currentPage - 1)}
                    >
                      Anterior
                    </button>
                    <span>
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      type="button"
                      className="dataset-list__page-button"
                      disabled={currentPage === totalPages}
                      onClick={() => setPage(currentPage + 1)}
                    >
                      Siguiente
                    </button>
                  </nav>
                )}
              </footer>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default DatasetList;
