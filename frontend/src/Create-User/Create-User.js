import React, {useState, useEffect} from "react";
import '../App.css'
import {Link, Redirect} from "react-router-dom";
import axios from "axios";
import sha256 from "crypto-js/sha256";
import db from '../VaultDb'
import Cookies from "js-cookie";
import './Create-User.css'

function CreateUser(props) {
    const [passMatch, updatePassMatch] = useState(0);
    const [createUserError, changeError] = useState(false);

    useEffect(() => {
        comparePasswords();
    }, [props.userData.confirmedPass])

    const handleSubmit = async (evt) => {
        evt.preventDefault();  
        if (evt.target.checkValidity() === false) {
            console.log("form is invalid");            
            evt.target.classList.add('was-validated')
            return;
        }  
        if (passMatch != 2) {
            return;
        }        
        let vault_key = calculateHash(props.userData.email + props.userData.password);
        let auth_key = calculateHash(props.userData.password + vault_key);
        try {
            const result = await axios.post('/api/v1/register/create_user/',
            {
                email: props.userData.email,
                auth_key: auth_key
            }, {withCredentials: true});
            if (result.status === 200) {
                let id = await db.vault_key.put({username:props.userData.email, key: vault_key});
                props.changeData({...props.userData, loggedIn: true});
                localStorage.setItem("email", props.userData.email)
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
        });               
    };

    const handleChangePage = (evt) => {
        props.changeData({
            email: "",
            password: "",
            confirmedPass: ""
        })
    }

    const comparePasswords = () => {        
        if (props.userData.confirmedPass.length > 0) {
            if (props.userData.password === props.userData.confirmedPass) {
                updatePassMatch(2);
            }
            else {
                updatePassMatch(1);
            }
            
        }
        else {
            updatePassMatch(0);
        }
    };

    const renderPassMatch = () => {        
        if (passMatch === 0) {
            return null
        }
        else if (passMatch === 1) {
            return (<div className="invalid-feedback d-block">Passwords do not match.</div>)
        }
        else {
            return (<div className="valid-feedback d-block">Passwords match.</div>)
        }
    }

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
                                <h2 className="text-dark mb-4 text-center">Sign Up</h2>
                                <form className="form needs-validation" onSubmit={handleSubmit} noValidate>
                                    {createUserError ? 
                                        <div class="alert alert-danger" role="alert" id={"errorAlert"}>
                                            This email is already in use.
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
                                        <input type="password" className="form-control" id="password1" name="password"
                                               placeholder="Password" value={props.userData.password} onChange={handleChange} required/>
                                        <div class="invalid-feedback">
                                            Please provide a password.
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" id="password2" name="confirmedPass"
                                               placeholder="Confirm Password" value={props.userData.confirmedPass} onChange={handleChange} required/>
                                        <div class="invalid-feedback">
                                            Please re-enter password.
                                        </div>
                                        {renderPassMatch()}
                                    </div>
                                    <div className="btn-block">
                                        <button type="submit" className="btn btn-primary btn-lg btn-block">
                                            Sign Up
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <h6 className="text-secondary text-center">Already have an account?</h6>
                            <Link to='/login' onClick={handleChangePage}>
                                <h6 className="text-secondary text-center">SIGN IN</h6>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateUser;
