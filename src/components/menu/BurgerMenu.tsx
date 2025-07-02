import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuList from "./MenuList";
import "./BurgerMenu.css";

const BurgerMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div>
      <button
        className="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setOpen(!open)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className={`collapse navbar-collapse custom-burger-menu burger-shadow${
          open ? " show" : ""
        }`}
        style={{
          background: "white",
          position: "absolute",
          top: 50,
          left: 0,
          zIndex: 1000,
        }}
      >
        <MenuList items={menuItems} />
      </div>
    </div>
  );
};

export default BurgerMenu;
