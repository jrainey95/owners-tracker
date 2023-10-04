import './index.scss';

import React from "react";
import { Link } from "react-router-dom";

import "../../src/App";

export default function Navbar() {
  return (
    <nav>
      <div>
        <h1>DOLPHIN TRACKER</h1>

        <div className="navbar-container">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/search" className="nav-link">
                SEARCH
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/aboutus" className="nav-link">
                ABOUT US
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/owners" className="nav-link">
                OWNERS
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                LOGIN
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link">
                SIGNUP
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
