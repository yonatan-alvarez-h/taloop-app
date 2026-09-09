import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DatasetDetailsPage from "../pages/DatasetDetails/DatasetDetailsPage";
import HomePage from "../pages/Home/HomePage";
import RegisterPage from "../pages/Register/RegisterPage";
import ChangePasswordPage from "../pages/ChangePassword/ChangePasswordPage";
import Loading from "../components/UI/Loading";
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
            <div className="mt-5 d-flex justify-content-center">
              <Loading
                size="lg"
                variant="spinner"
                text="Cargando datasets..."
                color="primary"
              />
            </div>
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
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route
        path="/users/:userId/change-password"
        element={<ChangePasswordPage />}
      />
      <Route
        path="/change-password/:userId"
        element={<ChangePasswordPage />}
      />
      <Route
        path="/cambiar-password/:userId"
        element={<ChangePasswordPage />}
      />
    </Routes>
  );
};

export default AppRoutes;
