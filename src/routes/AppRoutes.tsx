import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DatasetDetailsPage from "../pages/DatasetDetails/DatasetDetailsPage";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import ChangePasswordPage from "../pages/ChangePassword/ChangePasswordPage";
import Loading from "../components/UI/Loading";
import { fetchDatasets } from "../services/datasetsService";
import type { DatasetWithSamples } from "../types/dataset";
import { useAuth } from "../context/useAuth";
import { GuestRoute, ProtectedRoute } from "./RouteGuards";

const AppRoutes: React.FC<{
  search: string;
  onSearch: (q: string) => void;
}> = ({ search, onSearch }) => {
  const [datasets, setDatasets] = useState<DatasetWithSamples[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setDatasets([]);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    fetchDatasets()
      .then((data) => {
        if (active) setDatasets(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
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
        <Route path="/cambiar-password" element={<ChangePasswordPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
