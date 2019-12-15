import React from "react";

import '../App.css'
import './Login.css'
import {Link} from "react-router-dom";

function Login() {
    return(
        <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-dark mb-4 text-center">Sign In</h2>
                            <form className="form">
                                <div className="form-group">
                                    <input type="text" className="form-control" id="email"
                                           placeholder="Email"/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" id="password"
                                           placeholder="Password"/>
                                </div>
                                <div className="btn-block">
                                    <button type="button" className="btn btn-primary btn-lg btn-block">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                        <h6 className="text-secondary text-center">Don't have an account yet?</h6>
                        <Link to='/sign-up'>
                            <h6 className="text-secondary text-center">SIGN UP</h6>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
