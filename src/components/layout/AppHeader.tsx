import React from "react";
import { Link, NavLink } from "react-router-dom";
import NavBar from "../Menu/Nav/NavBar";
import SearchBar from "../Menu/Search/SearchBar";
import UserMenu from "../Menu/UserMenu/UserMenu";
import { useAuth } from "../../context/useAuth";
import "./AppHeader.css";

interface AppHeaderProps {
  search?: string;
  onSearch?: (query: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ search, onSearch }) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="app-header navbar">
      <Link to="/" className="app-header__brand" aria-label="Ir al catálogo">
        <NavBar />
      </Link>
      <div className="app-header__content">
        <nav className="app-header__nav" aria-label="Navegación principal">
          <NavLink to="/" end className="app-header__link">
            Catálogo
          </NavLink>
        </nav>
        {onSearch && (
          <div className="app-header__search">
            <SearchBar onSearch={onSearch} initialQuery={search} />
          </div>
        )}
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <div className="app-header__guest-actions">
            <Link to="/login" className="app-header__login-link">
              Iniciar sesión
            </Link>
            <Link to="/register" className="app-header__register-link">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
