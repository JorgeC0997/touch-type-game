import React from "react";
import { Link } from "react-router";

const NavBar = () => {
  return (
    <nav className="p-4 fixed top-0 left-0 w-screen flex justify-between align-center bg-white">
      <Link to="/">
        <p className="my-auto h-auto">Touch Type _</p>
      </Link>

      <Link to="/register">Register</Link>
    </nav>
  );
};

export default NavBar;
