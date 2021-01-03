import React, {useState} from 'react';
import './App.css';
import Nav from './Navbar/nav'
import CreateUser from "./Create-User/Create-User";
import Login from './Login/Login';
import Cookies from 'js-cookie'
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect
} from "react-router-dom";
import EditVault from "./EditVault/EditVault";
import Vault from "./Vault/Vault";
import Grid from "@material-ui/core/Grid";

function App() {
    const [userData, changeData] = useState({
        email: (localStorage.getItem("email") != null && Cookies.get('access_token')) ? localStorage.getItem("email") : "",
        password: "",
        confirmedPass: "",
        loggedIn: false
    });
    const [open, setOpen] = useState(false);

    const [filter, setFilter] = useState("");

    return (
        <Router>
            <div className="App-header">
                <Switch>
                    <Route exact path={"/"}>
                        {Cookies.get('access_token')} ? <Redirect to={"/vault"}/> : <Redirect to={"/login"}/>
                    </Route>
                    <Route exact path="/vault" render={(props) => {
                        return (
                            <Grid container direction={'column'}>
                                <Grid item>
                                    <Nav changeData={changeData} userData={userData} open={open} setOpen={setOpen} setFilter={setFilter}/>
                                </Grid>
                                <Grid item>
                                    <Vault open={open} setOpen={setOpen} filter={filter}/>
                                </Grid>
                            </Grid>
                        )
                    }}/>
                    <Route exact path="/login" render={(props) => <Login changeData={changeData} userData={userData}/>}/>
                    <Route exact path="/sign-up" render={(props) => <CreateUser changeData={changeData} userData={userData}/>}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
