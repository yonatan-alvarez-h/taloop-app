import React, { useState } from "react";
import DatasetGrid from "./DatasetGrid";
import type { Dataset } from "../../types/dataset";

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
  const [pageSize, setPageSize] = useState(10);
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

  const controls = (
    <>
      <div className="d-flex justify-content-end align-items-center mb-3">
        <label className="me-2 mb-0" htmlFor="pageSizeSelect">
          Resultados por página:
        </label>
        <select
          id="pageSizeSelect"
          className="form-select form-select-sm w-auto"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={4}>4</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
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
    </>
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {outerPagination && controls}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {!outerPagination && controls}
        <DatasetGrid datasets={paginated} />
      </div>
    </div>
  );
};

export default DatasetList;
