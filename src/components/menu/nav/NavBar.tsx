import React from "react";
import logo from "../../../assets/taloop-logo.png";
import "./NavBar.css";

const NavBar: React.FC = () => {
  return (
    <img
      className="taloop-logo"
      src={logo}
      alt="taloop"
    />
  );
};

export default NavBar;
