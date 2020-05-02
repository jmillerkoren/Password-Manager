import React, {useState} from "react";
import '../App.css'
import {Link, Redirect} from "react-router-dom";
import axios from "axios";
import sha256 from "crypto-js/sha256";

function CreateUser(props) {

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let hash = calculateHash();
        const result = await axios.post('/api/v1/register/create_user/',
            {
                auth_key: hash
            }, {withCredentials: true});
        if (result.status === 200) {
            console.log("request is 200");
            props.changeData({...props.userData, loggedIn: true});
            localStorage.setItem("email", props.userData.email)
        }
    };

    const calculateHash = () => {
        let hash = props.userData.email + props.userData.password;
        for (let i = 0; i < 5000; ++i) {
            hash = sha256(hash).toString();
        }
        return hash;
    };

    const handleChange = (evt) => {
        const value = evt.target.value;
        props.changeData({
            ...props.userData,
            [evt.target.name]: value
        })
    };

    if(props.userData.loggedIn) {
        console.log("Hit logged in")
        return <Redirect to={"/"}/>;
    }

    return(
        <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-dark mb-4 text-center">Sign Up</h2>
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="email" name="email"
                                           placeholder="Email" value={props.userData.email} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" id="password1" name="password"
                                           placeholder="Password" value={props.userData.password} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" id="password2" name="confirmedPass"
                                           placeholder="Confirm Password" value={props.userData.confirmedPass} onChange={handleChange}/>
                                </div>
                                <div className="btn-block">
                                    <button type="submit" className="btn btn-primary btn-lg btn-block">
                                        Sign Up
                                    </button>
                                </div>
                            </form>
                        </div>
                        <h6 className="text-secondary text-center">Already have an account?</h6>
                        <Link to='/login'>
                            <h6 className="text-secondary text-center">SIGN IN</h6>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateUser;
