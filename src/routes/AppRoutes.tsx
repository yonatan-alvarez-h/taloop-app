import React from "react";
import { Routes, Route } from "react-router-dom";
// import DatasetRouter from "../DatasetRouter";
import DatasetDetailsPage from "../pages/DatasetDetails/DatasetDetailsPage";
import HomePage from "../pages/Home/HomePage";
import datasetsData from "../data/datasetsData";

const AppRoutes: React.FC<{
  search: string;
  onSearch: (q: string) => void;
}> = ({ search, onSearch }) => (
  <Routes>
    <Route
      path="/"
      element={
        <HomePage datasets={datasetsData} search={search} onSearch={onSearch} />
      }
    />
    <Route path="/datasets/:uid" element={<DatasetDetailsPage />} />
  </Routes>
);

export default AppRoutes;
