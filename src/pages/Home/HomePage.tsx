import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/Menu/Nav/NavBar";
import SearchBar from "../../components/Menu/Search/SearchBar";
import DatasetList from "../../components/Dataset/List/DatasetList";
import { useAuth } from "../../context/useAuth";

import type { Dataset } from "../../types/dataset";
import "./HomePage.css";

interface HomePageProps {
  datasets: Dataset[];
  search: string;
  onSearch: (query: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ datasets, search, onSearch }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
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
      <nav className="navbar">
        <NavBar />
        <div className="homepage-nav-actions">
          <div className="homepage-searchbar">
            <SearchBar onSearch={onSearch} />
          </div>
          <Link to="/register" className="homepage-register-link">
            Registrarse
          </Link>
          <button
            type="button"
            className="homepage-logout-button"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
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
