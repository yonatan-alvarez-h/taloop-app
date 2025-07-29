import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DatasetDetailsPage from "../pages/DatasetDetails/DatasetDetailsPage";
import HomePage from "../pages/Home/HomePage";
import { fetchDatasets } from "../services/datasetsService";
import type { DatasetWithSamples } from "../types/dataset";

const AppRoutes: React.FC<{
  search: string;
  onSearch: (q: string) => void;
}> = ({ search, onSearch }) => {
  const [datasets, setDatasets] = useState<DatasetWithSamples[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatasets()
      .then(setDatasets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          loading ? (
            <div className="mt-5 text-center">Cargando datasets...</div>
          ) : error ? (
            <div className="alert alert-danger mt-5 text-center">
              Error: {error}
            </div>
          ) : (
            <HomePage datasets={datasets} search={search} onSearch={onSearch} />
          )
        }
      />
      <Route path="/datasets/:_id" element={<DatasetDetailsPage />} />
    </Routes>
  );
};

export default AppRoutes;
