import React from "react";
import { NavLink } from "react-router";

const NavBarLink = ({ children, urlPath }) => {
  return (
    <NavLink
      to={urlPath}
      className={({ isActive }) => (isActive ? "font-bold underline" : null)}
    >
      {children}
    </NavLink>
  );
};

export default NavBarLink;
