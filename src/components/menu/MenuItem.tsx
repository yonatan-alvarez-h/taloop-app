import React from "react";

interface MenuItemProps {
  label: string;
  href: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, href }) => (
  <li className="nav-item">
    <a className="nav-link" href={href}>
      {label}
    </a>
  </li>
);

export default MenuItem;
