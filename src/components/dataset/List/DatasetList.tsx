import React, { useEffect, useState } from "react";
import DatasetGrid from "../Grid";
import WelcomeSection from "../../Home/Welcome/WelcomeSection";
import type { Dataset } from "../../../types/dataset";
import "./DatasetList.css";

interface DatasetListProps {
  datasets: Dataset[];
  search: string;
  outerPagination?: boolean;
  onSearch?: (query: string) => void;
}

type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

const getPaginationItems = (
  currentPage: number,
  totalPages: number
): PaginationItem[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis-end", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis-start", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis-start", currentPage, "ellipsis-end", totalPages];
};

interface DatasetPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DatasetPagination: React.FC<DatasetPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Paginación de resultados">
      <ul className="pagination datasetlist-pagination">
        <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Ir a la página anterior"
          >
            Anterior
          </button>
        </li>
        {getPaginationItems(currentPage, totalPages).map((item) => {
          if (typeof item !== "number") {
            return (
              <li
                key={item}
                className="page-item pagination-ellipsis"
                aria-hidden="true"
              >
                <span className="page-link">…</span>
              </li>
            );
          }

          return (
            <li
              key={item}
              className={`page-item${currentPage === item ? " active" : ""}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => onPageChange(item)}
                aria-current={currentPage === item ? "page" : undefined}
                aria-label={`Ir a la página ${item}`}
              >
                {item}
              </button>
            </li>
          );
        })}
        <li
          className={`page-item${
            currentPage === totalPages ? " disabled" : ""
          }`}
        >
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Ir a la página siguiente"
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  search,
  outerPagination,
  onSearch = () => {},
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const filtered = datasets.filter(
    (ds) =>
      ds.title.toLowerCase().includes(search.toLowerCase()) ||
      ds.description.toLowerCase().includes(search.toLowerCase()) ||
      ds.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
      ds.owner.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (!search) {
    // Opción 1: Diseño colorido y dinámico (ACTIVO)
    return <WelcomeSection datasets={datasets} onSearch={onSearch} />;

    // Opción 2: Diseño corporativo y profesional
    // return <WelcomeSectionAlt datasets={datasets} onSearch={onSearch} />;
  }
  if (filtered.length === 0) {
    return (
      <div className="dataset-list-no-results alert alert-info">
        <div className="no-results-icon">🔍</div>
        <h5 className="no-results-title">¡Ups! No encontramos datasets</h5>
        <p className="no-results-description">
          No hay datasets que coincidan con "<strong>{search}</strong>".
        </p>
        <div className="no-results-suggestions">
          <p className="mb-2">
            💡 <strong>Prueba con:</strong>
          </p>
          <ul className="suggestions-list">
            <li>Términos más generales</li>
            <li>Verificar la ortografía</li>
            <li>Buscar por categoría o columna específica</li>
            <li>Usar sinónimos o palabras relacionadas</li>
          </ul>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  return (
    <div className="dataset-list">
      {outerPagination && (
        <div className="datasetlist-controls datasetlist-controls--outer">
          <div className="page-size">
            <label className="me-2 mb-0" htmlFor="pageSizeSelectOuter">
              Resultados por página:
            </label>
            <select
              id="pageSizeSelectOuter"
              className="form-select form-select-sm w-auto"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
          <span className="total-results">{filtered.length} resultados</span>
          <DatasetPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
      <div className="dataset-list__content">
        {!outerPagination && (
          <div className="datasetlist-controls datasetlist-controls--inner">
            <div className="page-size">
              <label className="me-2 mb-0" htmlFor="pageSizeSelectInner">
                Resultados por página:
              </label>
              <select
                id="pageSizeSelectInner"
                className="form-select form-select-sm w-auto"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
            <span className="total-results">{filtered.length} resultados</span>
            <DatasetPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
        <DatasetGrid datasets={paginated} />
      </div>
    </div>
  );
};

export default DatasetList;
