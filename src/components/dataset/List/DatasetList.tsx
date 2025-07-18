import React, { useState } from "react";
import DatasetGrid from "../Grid/DatasetGrid";
import type { Dataset } from "../../../types/dataset";
import "./DatasetList.css";

interface DatasetListProps {
  datasets: Dataset[];
  search: string;
  outerPagination?: boolean;
}

const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  search,
  outerPagination,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const filtered = datasets.filter(
    (ds) =>
      ds.title.toLowerCase().includes(search.toLowerCase()) ||
      ds.description.toLowerCase().includes(search.toLowerCase()) ||
      ds.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
      ds.fields.some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      ) ||
      ds.owner.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!search) return null;
  if (filtered.length === 0) {
    return (
      <div className="alert alert-warning mt-3">
        No se encontraron datasets.
      </div>
    );
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

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
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
          <span className="total-results">{filtered.length} resultados</span>
          <nav>
            <ul className="pagination datasetlist-pagination">
              <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item${page === i + 1 ? " active" : ""}`}
                >
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item${page === totalPages ? " disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
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
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
            <span className="total-results">{filtered.length} resultados</span>
            <nav>
              <ul className="pagination datasetlist-pagination">
                <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Anterior
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item${page === i + 1 ? " active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item${
                    page === totalPages ? " disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
        <DatasetGrid datasets={paginated} />
      </div>
    </div>
  );
};

export default DatasetList;
