import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import { useInvitations } from "../../../context/useInvitations";
import NavBar from "../Nav/NavBar";
import "./UserMenu.css";

type MenuIconName =
  | "heart"
  | "owners"
  | "invitations"
  | "profile"
  | "password"
  | "logout";

const MenuIcon: React.FC<{ name: MenuIconName }> = ({ name }) => {
  const paths: Record<MenuIconName, React.ReactNode> = {
    heart: <path d="M20.8 8.6c0 5.2-8.8 10.1-8.8 10.1S3.2 13.8 3.2 8.6A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z" />,
    owners: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M15 5.5a3 3 0 0 1 0 5.8M17 14.5a5.5 5.5 0 0 1 3.5 5" />
      </>
    ),
    invitations: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    password: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
        <path d="m14 8 4 4-4 4M8 12h10" />
      </>
    ),
  };

  return (
    <svg
      className="user-menu-item-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
};

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { invitations } = useInvitations();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const animationFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [closeMenu, isOpen]);

  const handleDrawerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;

    const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])"
    );
    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="user-menu">
      <button
        ref={triggerRef}
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

      {isOpen &&
        createPortal(
          <div className="user-menu-layer">
            <button
              type="button"
              className="user-menu-backdrop"
              aria-label="Cerrar menú de usuario"
              onClick={closeMenu}
            />
            <aside
              ref={drawerRef}
              id="user-menu-options"
              className="user-menu-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de usuario"
              onKeyDown={handleDrawerKeyDown}
            >
              <div className="user-menu-drawer__header">
                <NavBar />
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="user-menu-close"
                  aria-label="Cerrar menú de usuario"
                  onClick={closeMenu}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <nav className="user-menu-navigation" aria-label="Navegación del usuario">
                <section className="user-menu-section" aria-labelledby="user-menu-navigation-title">
                  <h2 id="user-menu-navigation-title" className="user-menu-section-title">
                    Navegación
                  </h2>
                  <NavLink to="/intereses" className="user-menu-item" onClick={closeMenu}>
                    <MenuIcon name="heart" />
                    <span>Mis intereses</span>
                  </NavLink>
                  <NavLink to="/owners" className="user-menu-item" onClick={closeMenu}>
                    <MenuIcon name="owners" />
                    <span>Mis owners</span>
                  </NavLink>
                  <NavLink
                    to="/invitaciones"
                    className="user-menu-item user-menu-item--with-badge"
                    onClick={closeMenu}
                  >
                    <span className="user-menu-item__content">
                      <MenuIcon name="invitations" />
                      <span>Invitaciones</span>
                    </span>
                    {invitations.length > 0 && (
                      <span className="user-menu-badge" aria-label={`${invitations.length} pendientes`}>
                        {invitations.length}
                      </span>
                    )}
                  </NavLink>
                </section>

                <div className="user-menu-divider" />

                <section className="user-menu-section" aria-labelledby="user-menu-account-title">
                  <h2 id="user-menu-account-title" className="user-menu-section-title">
                    Cuenta
                  </h2>
                  <NavLink to="/perfil" className="user-menu-item" onClick={closeMenu}>
                    <MenuIcon name="profile" />
                    <span>Modificar datos personales</span>
                  </NavLink>
                  <NavLink to="/cambiar-password" className="user-menu-item" onClick={closeMenu}>
                    <MenuIcon name="password" />
                    <span>Cambiar contraseña</span>
                  </NavLink>
                </section>
              </nav>

              <div className="user-menu-drawer__footer">
                <button
                  type="button"
                  className="user-menu-item user-menu-item--danger"
                  onClick={handleLogout}
                >
                  <MenuIcon name="logout" />
                  <span>Salir</span>
                </button>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </div>
  );
};

export default UserMenu;
