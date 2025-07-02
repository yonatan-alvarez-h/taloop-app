import React from "react";
import MenuItem from "./MenuItem";

interface MenuListProps {
  items: { label: string; href: string }[];
}

const MenuList: React.FC<MenuListProps> = ({ items }) => (
  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
    {items.map((item) => (
      <MenuItem key={item.href} label={item.label} href={item.href} />
    ))}
  </ul>
);

export default MenuList;
