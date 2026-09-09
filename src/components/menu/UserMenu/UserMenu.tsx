import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import "./UserMenu.css";

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-expanded={isOpen}
        aria-controls="user-menu-options"
        aria-label={isOpen ? "Cerrar menú de usuario" : "Abrir menú de usuario"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="user-menu-trigger-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {isOpen && (
        <div
          id="user-menu-options"
          className="user-menu-dropdown"
          role="menu"
          aria-label="Opciones de usuario"
        >
          <Link
            to="/cambiar-password"
            className="user-menu-item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Cambiar contraseña
          </Link>
          <Link
            to="/perfil"
            className="user-menu-item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Modificar datos personales
          </Link>
          <button
            type="button"
            className="user-menu-item user-menu-item--danger"
            role="menuitem"
            onClick={handleLogout}
          >
            Salir
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
