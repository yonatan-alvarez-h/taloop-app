import React, { useEffect } from "react";
import AppHeader from "../../components/layout/AppHeader";
import DatasetList from "../../components/Dataset/List/DatasetList";

import type { Dataset } from "../../types/dataset";
import "./HomePage.css";

interface HomePageProps {
  datasets: Dataset[];
  search: string;
  onSearch: (query: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ datasets, search, onSearch }) => {
  // Aplicar clase para eliminar scroll global solo en HomePage
  useEffect(() => {
    document.body.classList.add("no-global-scroll");

    // Cleanup: remover la clase cuando se desmonte el componente
    return () => {
      document.body.classList.remove("no-global-scroll");
    };
  }, []);

  return (
    <div className="homepage-wrapper">
      <AppHeader search={search} onSearch={onSearch} />
      <div className="homepage-container container">
        <div className="homepage-content">
          <DatasetList
            datasets={datasets}
            search={search}
            onSearch={onSearch}
            outerPagination
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
