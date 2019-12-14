import React from "react";
import './nav.css';
import {Link} from "react-router-dom";

function Nav() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto">
                    <Link to="/" className="nav-link">
                        <li className="nav-item">Password Manager</li>
                    </Link>
                    <Link to="/about" className="nav-link">
                        <li className="nav-item">About</li>
                    </Link>
                    <Link to="/getting-started" className="nav-link">
                        <li className="nav-item">Getting Started</li>
                    </Link>
                </ul>
                <ul className="navbar-nav">
                    <Link to="/account" className="nav-link">
                        <li className="nav-item">Create Account</li>
                    </Link>
                    <Link to="/login" className="nav-link">
                        <li className="nav-item">Login</li>
                    </Link>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;
