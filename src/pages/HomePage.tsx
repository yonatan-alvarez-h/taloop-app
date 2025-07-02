import React from "react";
import BurgerMenu from "../components/menu/BurgerMenu";
import SearchBar from "../components/search/SearchBar";
import DatasetList from "../components/dataset/DatasetList";
import type { Dataset } from "../types/dataset";

interface HomePageProps {
  datasets: Dataset[];
  search: string;
  onSearch: (query: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ datasets, search, onSearch }) => (
  <div>
    <nav className="navbar navbar-light bg-light px-3 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <BurgerMenu />
        <span className="navbar-brand mb-0 h1 ms-2">taloop</span>
      </div>
      <div style={{ width: "300px" }}>
        <SearchBar onSearch={onSearch} />
      </div>
    </nav>
    <div
      className="container mt-4"
      style={{
        height: "calc(100vh - 90px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: "0 0 auto" }}></div>
      <DatasetList datasets={datasets} search={search} outerPagination />
    </div>
  </div>
);

export default HomePage;
