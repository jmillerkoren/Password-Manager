import React from "react";
import '../App.css'
import './Login.css'

function Login() {
    return(
        <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-dark mb-4 text-center">Login</h2>
                            <form className="form">
                                <div className="form-group">
                                    <input type="text" className="form-control" id="email"
                                           placeholder="Email"/>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="password"
                                           placeholder="Password"/>
                                </div>
                                <div className="btn">
                                    <input className="btn btn-primary" type="submit" value="Submit"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Login;
