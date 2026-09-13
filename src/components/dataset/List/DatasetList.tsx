import React, { useCallback, useEffect, useMemo, useState } from "react";
import DatasetGrid from "../Grid";
import FacetFilter, {
  type FacetOption,
} from "../../common/FacetFilter";
import type { Dataset } from "../../../types/dataset";
import "./DatasetList.css";

interface DatasetListProps {
  datasets: Dataset[];
  search: string;
  onSearch?: (query: string) => void;
}

type SortOption = "relevance" | "quality" | "rating" | "price";
type PriceFilter = "free" | "under-25" | "25-49" | "50-99" | "100-plus";
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

const normalizeText = (item: string) =>
  item
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

const value = (item?: string) => normalizeText(item?.trim() || "");

const getOwnerValue = (dataset: Dataset) =>
  dataset.owner_id?.trim() || value(dataset.owner?.name);

const getQualityLevel = (quality?: number) =>
  qualityLevels.find((level) => quality !== undefined && quality >= level.minimum)
    ?.value;

const getPriceBucket = (price: number): PriceFilter => {
  if (price === 0) return "free";
  if (price < 25) return "under-25";
  if (price < 50) return "25-49";
  if (price < 100) return "50-99";
  return "100-plus";
};

const priceBuckets: { value: PriceFilter; label: string }[] = [
  { value: "free", label: "Gratis" },
  { value: "under-25", label: "Menos de $25" },
  { value: "25-49", label: "$25–$49" },
  { value: "50-99", label: "$50–$99" },
  { value: "100-plus", label: "$100 o más" },
];

const getTextOptions = (
  datasets: Dataset[],
  getLabel: (dataset: Dataset) => string | undefined,
  exclude?: string,
  getOptionValue?: (dataset: Dataset) => string
) => {
  const found = new Map<
    string,
    { value: string; label: string; count: number }
  >();
  datasets.forEach((dataset) => {
    const label = getLabel(dataset)?.trim();
    const normalizedLabel = value(label);
    const optionValue = getOptionValue?.(dataset) || normalizedLabel;
    if (
      !label ||
      !normalizedLabel ||
      !optionValue ||
      normalizedLabel === exclude
    ) {
      return;
    }
    const current = found.get(optionValue);
    found.set(optionValue, {
      value: optionValue,
      label: current?.label || label,
      count: (current?.count || 0) + 1,
    });
  });
  return [...found.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label, "es")
  );
};

const keepSelectedOptions = (
  options: FacetOption[],
  allOptions: FacetOption[],
  selected: string[]
) => {
  const present = new Set(options.map((option) => option.value));
  const selectedMissing = allOptions
    .filter((option) => selected.includes(option.value) && !present.has(option.value))
    .map((option) => ({ ...option, count: 0 }));
  return [...options, ...selectedMissing];
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
  const [facetResetKey, setFacetResetKey] = useState(0);
  const normalizedSearch = value(search);

  const indexedDatasets = useMemo(
    () =>
      datasets.map((dataset) => ({
        dataset,
        searchable: normalizeText(
          [
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
        ),
        category: value(dataset.category),
        owner: getOwnerValue(dataset),
        price: getPriceBucket(dataset.priceUsd),
        quality: getQualityLevel(score(dataset)),
      })),
    [datasets]
  );
  const matchesFilters = useCallback(
    (
      item: (typeof indexedDatasets)[number],
      ignored?: "category" | "owner" | "price" | "quality"
    ) => {
      return (
        (!normalizedSearch || item.searchable.includes(normalizedSearch)) &&
        (ignored === "category" ||
          !categories.length ||
          categories.includes(item.category)) &&
        (ignored === "owner" ||
          !owners.length ||
          owners.includes(item.owner)) &&
        (ignored === "price" ||
          !prices.length ||
          prices.includes(item.price)) &&
        (ignored === "quality" ||
          !qualities.length ||
          (item.quality !== undefined && qualities.includes(item.quality)))
      );
    },
    [categories, normalizedSearch, owners, prices, qualities]
  );

  const categoryOptions = useMemo(() => {
    const allOptions = getTextOptions(datasets, (dataset) => dataset.category);
    return keepSelectedOptions(
      getTextOptions(
        indexedDatasets
          .filter((item) => matchesFilters(item, "category"))
          .map((item) => item.dataset),
        (dataset) => dataset.category
      ),
      allOptions,
      categories
    );
  }, [categories, datasets, indexedDatasets, matchesFilters]);
  const ownerOptions = useMemo(() => {
    const allOptions = getTextOptions(
      datasets,
      (dataset) => dataset.owner?.name,
      "proveedor no disponible",
      getOwnerValue
    );
    return keepSelectedOptions(
      getTextOptions(
        indexedDatasets
          .filter((item) => matchesFilters(item, "owner"))
          .map((item) => item.dataset),
        (dataset) => dataset.owner?.name,
        "proveedor no disponible",
        getOwnerValue
      ),
      allOptions,
      owners
    );
  }, [datasets, indexedDatasets, matchesFilters, owners]);
  const qualityOptions = useMemo(() => {
    const counts = new Map<QualityFilter, number>();
    indexedDatasets
      .filter((item) => matchesFilters(item, "quality"))
      .forEach(({ quality }) => {
        if (quality) {
          counts.set(quality, (counts.get(quality) || 0) + 1);
        }
      });
    const availableOptions = qualityLevels
      .map((level) => ({
        value: level.value,
        label: level.label,
        count: counts.get(level.value) || 0,
      }))
      .filter((level) => level.count > 0);
    return keepSelectedOptions(
      availableOptions,
      qualityLevels.map((level) => ({
        value: level.value,
        label: level.label,
        count: 0,
      })),
      qualities
    );
  }, [indexedDatasets, matchesFilters, qualities]);
  const priceOptions = useMemo(() => {
    const counts = new Map<PriceFilter, number>();
    indexedDatasets
      .filter((item) => matchesFilters(item, "price"))
      .forEach(({ price }) => {
        counts.set(price, (counts.get(price) || 0) + 1);
      });
    const availableOptions = priceBuckets
      .map((bucket) => ({
        ...bucket,
        count: counts.get(bucket.value) || 0,
      }))
      .filter((bucket) => bucket.count > 0);
    return keepSelectedOptions(
      availableOptions,
      priceBuckets.map((bucket) => ({ ...bucket, count: 0 })),
      prices
    );
  }, [indexedDatasets, matchesFilters, prices]);

  const filtered = useMemo(() => {
    return indexedDatasets
      .filter((item) => matchesFilters(item))
      .map((item) => item.dataset);
  }, [indexedDatasets, matchesFilters]);

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

  const clearFilters = () => {
    setCategories([]);
    setOwners([]);
    setPrices([]);
    setQualities([]);
    setFacetResetKey((current) => current + 1);
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
          <FacetFilter
            key={`category-${facetResetKey}`}
            label="Categoría"
            options={categoryOptions}
            selected={categories}
            onToggle={(item) => toggle(item, categories, setCategories)}
            searchable
          />
          <FacetFilter
            key={`owner-${facetResetKey}`}
            label="Proveedor"
            options={ownerOptions}
            selected={owners}
            onToggle={(item) => toggle(item, owners, setOwners)}
            searchable
          />
          <FacetFilter
            key={`price-${facetResetKey}`}
            label="Precio"
            options={priceOptions}
            selected={prices}
            onToggle={(item) => toggle(item as PriceFilter, prices, setPrices)}
          />
          <FacetFilter
            key={`quality-${facetResetKey}`}
            label="Calidad"
            options={qualityOptions}
            selected={qualities}
            onToggle={(item) =>
              toggle(item as QualityFilter, qualities, setQualities)
            }
          />
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
