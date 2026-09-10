import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DatasetDetailsPage from "../pages/DatasetDetails/DatasetDetailsPage";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import ChangePasswordPage from "../pages/ChangePassword/ChangePasswordPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import InterestsPage from "../pages/Interests/InterestsPage";
import MyOwnersPage from "../pages/Owners/MyOwnersPage";
import OwnerDetailPage from "../pages/Owners/OwnerDetailPage";
import InvitationsPage from "../pages/Invitations/InvitationsPage";
import Loading from "../components/UI/Loading";
import AppHeader from "../components/layout/AppHeader";
import { fetchDatasets } from "../services/datasetsService";
import type { DatasetWithSamples } from "../types/dataset";
import { GuestRoute, ProtectedRoute } from "./RouteGuards";

const AppRoutes: React.FC<{
  search: string;
  onSearch: (q: string) => void;
}> = ({ search, onSearch }) => {
  const [datasets, setDatasets] = useState<DatasetWithSamples[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadDatasets = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchDatasets()
      .then((data) => {
        if (active) {
          setDatasets(
            data.filter(
              (dataset) =>
                dataset.status === "active" && dataset.visibility === "public"
            )
          );
        }
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
  }, []);

  useEffect(() => loadDatasets(), [loadDatasets]);

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>
      <Route
        path="/"
        element={
          loading ? (
            <>
              <AppHeader />
              <div className="mt-5 d-flex justify-content-center">
                <Loading
                  size="lg"
                  variant="spinner"
                  text="Cargando datasets..."
                  color="primary"
                />
              </div>
            </>
          ) : error ? (
            <>
              <AppHeader />
              <div className="alert alert-danger mt-5 text-center">
                Error: {error}
                <div className="mt-3">
                  <button type="button" className="btn btn-outline-danger" onClick={loadDatasets}>
                    Reintentar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <HomePage datasets={datasets} search={search} onSearch={onSearch} />
          )
        }
      />
      <Route path="/datasets/:_id" element={<DatasetDetailsPage />} />
      <Route path="/owners/:ownerId" element={<OwnerDetailPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/intereses" element={<InterestsPage />} />
        <Route path="/owners" element={<MyOwnersPage />} />
        <Route path="/invitaciones" element={<InvitationsPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/perfil/:userId" element={<ProfilePage />} />
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
