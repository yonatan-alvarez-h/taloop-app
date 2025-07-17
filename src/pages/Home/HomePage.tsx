import React from "react";
import NavBar from "../../components/nav/NavBar";
import SearchBar from "../../components/search/SearchBar";
import DatasetList from "../../components/dataset/List/DatasetList";

import type { Dataset } from "../../types/dataset";
import "./HomePage.css";

interface HomePageProps {
  datasets: Dataset[];
  search: string;
  onSearch: (query: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ datasets, search, onSearch }) => (
  <div>
    <nav className="homepage-navbar">
      <NavBar />
      <div className="homepage-searchbar">
        <SearchBar onSearch={onSearch} />
      </div>
    </nav>
    <div className="homepage-container container">
      <div style={{ flex: "0 0 auto" }}></div>
      <DatasetList datasets={datasets} search={search} outerPagination />
    </div>
  </div>
);

export default HomePage;
