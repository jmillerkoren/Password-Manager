import React, {useState} from "react";

import '../App.css'
import './Login.css'
import {Link, Redirect} from "react-router-dom";
import axios from 'axios'
import sha256 from "crypto-js/sha256";
import db from "../VaultDb";
import Cookies from "js-cookie";

function Login(props) {
    const [loginError, changeError] = useState(false);

    const handleSubmit = async (evt) => {
        if (evt.target.checkValidity() === false) {
            console.log("form is invalid");
            evt.preventDefault();
            evt.target.classList.add('was-validated')
            return;
        }    
        evt.preventDefault(); 
        let vault_key = calculateHash(props.userData.email + props.userData.password);
        let auth_key = calculateHash(props.userData.password + vault_key);
        try {
            const result = await axios.post('/api/v1/login/login_user/', {
                email: props.userData.email,
                auth_key: auth_key
            }, {withCredentials: true});

            if (result.status === 200) {
                let id = await db.vault_key.put({username:props.userData.email, key: vault_key});
                localStorage.setItem("email", props.userData.email)
                props.changeData({...props.userData, loggedIn: true})
            }
        }   
        catch (err) {
            if (err.response.status === 500) {
                changeError(true);
            }
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

    const handleChangePage = (evt) => {
        props.changeData({
            email: "",
            password: "",
            confirmedPass: ""
        })
    };

    const removeError = (evt) => {
        changeError(false);
    }

    if(Cookies.get('access_token')) {
        return <Redirect to={"/vault"}/>;
    }

    return(
        <div style={{height: '100vh'}}>
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-4">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="text-dark mb-4 text-center">Sign In</h2>
                                <form className="form needs-validation" onSubmit={handleSubmit} noValidate>
                                    {loginError ? 
                                    <div class="alert alert-danger" role="alert" id={"errorAlert"}>
                                        Incorrect email or password
                                        <button type="button" class="close" onClick={removeError}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div> : null }
                                    <div className="form-group">
                                        <input type="text" className="form-control" id="email" name="email"
                                               placeholder="Email" value={props.userData.email} onChange={handleChange} required/>
                                        <div class="invalid-feedback">
                                            Please provide an email.
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" id="password" name="password"
                                               placeholder="Password" value={props.userData.password} onChange={handleChange} required/>
                                        <div class="invalid-feedback">
                                            Please provide a password.
                                        </div>
                                    </div>
                                    <div className="btn-block">
                                        <button type="submit" className="btn btn-primary btn-lg btn-block">
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <h6 className="text-secondary text-center">Don't have an account yet?</h6>
                            <Link to='/sign-up' onClick={handleChangePage}>
                                <h6 className="text-secondary text-center">SIGN UP</h6>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
