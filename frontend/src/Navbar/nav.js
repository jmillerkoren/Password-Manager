import React from "react";
import './nav.css';
import {Link} from "react-router-dom";

function Nav() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto">
                    <Link to="/" className="nav-link">
                        <li className="nav-item text-white">Password Manager</li>
                    </Link>
                    <Link to="/about" className="nav-link ml-3">
                        <li className="nav-item" id="nav-item">About</li>
                    </Link>
                    <Link to="/getting-started" className="nav-link">
                        <li className="nav-item" id="nav-item">Getting Started</li>
                    </Link>
                </ul>
                <ul className="navbar-nav">
                    <Link to="/sign-up" className="nav-link mr-2">
                        <li className="nav-item" id="nav-item">Sign Up</li>
                    </Link>
                    <Link to="/login" className="nav-link">
                        <li className="nav-item" id="nav-item">Login</li>
                    </Link>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;
