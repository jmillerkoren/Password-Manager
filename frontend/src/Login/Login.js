import React, {useState} from "react";

import '../App.css'
import './Login.css'
import {Link} from "react-router-dom";
import axios from 'axios'
import sha256 from "crypto-js/sha256";

function Login() {
    const [formData, changeData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let encryptionKey = calculateHash();
        const result = await axios.post('http://127.0.0.1:8000/api/v1/login/login_user/', {
            auth_key: encryptionKey
        }, {withCredentials: true});
        console.log(encryptionKey);
        console.log(result)
    };

    const calculateHash = () => {
        let hash = formData.email + formData.password;
        for (let i = 0; i < 5000; ++i) {
            hash = sha256(hash).toString();
        }
        return hash;
    };

    const handleChange = (evt) => {
        const value = evt.target.value;
        changeData({
            ...formData,
            [evt.target.name]: value
        })
    };

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
                                           placeholder="Email" value={formData.email} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" id="password" name="password"
                                           placeholder="Password" value={formData.password} onChange={handleChange}/>
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
