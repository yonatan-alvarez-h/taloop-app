import React from "react";
import NavBar from "../../components/Menu/Nav/NavBar";
import SearchBar from "../../components/Menu/Search/SearchBar";
import DatasetList from "../../components/Dataset/List/DatasetList";

import type { Dataset } from "../../types/dataset";
import "./HomePage.css";

interface HomePageProps {
  datasets: Dataset[];
  search: string;
  onSearch: (query: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ datasets, search, onSearch }) => (
  <div>
    <nav className="navbar">
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
