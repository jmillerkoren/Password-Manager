import React, {useState} from "react";

import '../App.css'
import './Login.css'
import {Link, Redirect} from "react-router-dom";
import axios from 'axios'
import sha256 from "crypto-js/sha256";
import db from "../VaultDb";

function Login(props) {
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let vault_key = calculateHash(props.userData.email + props.userData.password);
        let auth_key = calculateHash(props.userData.password + vault_key);
        let id = await db.vault_key.put({username:props.userData.email ,key: vault_key});
        const result = await axios.post('/api/v1/login/login_user/', {
            email: props.userData.email,
            auth_key: auth_key
        }, {withCredentials: true});
        if (result.status === 200) {
            localStorage.setItem("email", props.userData.email)
            props.changeData({...props.userData, loggedIn: true})
        }
    };

    const calculateHash = (message) => {
        for (let i = 0; i < 5000; ++i) {
            message = sha256(message).toString();
        }
        return message;
    };

    const handleChange = (evt) => {
        const value = evt.target.value;
        props.changeData({
            ...props.userData,
            [evt.target.name]: value
        })
    };

    if(props.userData.loggedIn) {
        return <Redirect to={"/"}/>;
    }

    return(
        <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-dark mb-4 text-center">Sign In</h2>
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="email" name="email"
                                           placeholder="Email" value={props.userData.email} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" id="password" name="password"
                                           placeholder="Password" value={props.userData.password} onChange={handleChange}/>
                                </div>
                                <div className="btn-block">
                                    <button type="submit" className="btn btn-primary btn-lg btn-block">
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
