import React, {useState} from 'react';
import './App.css';
import Nav from './Navbar/nav'
import Homepage from "./Homepage/Homepage";
import CreateUser from "./Create-User/Create-User";
import Login from './Login/Login';
import Cookies from 'js-cookie'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import About from "./About/About";

function App() {
const [userData, changeData] = useState({
    email: (localStorage.getItem("email") != null && Cookies.get('access_token')) ? localStorage.getItem("email") : "",
    password: "",
    confirmedPass: "",
    loggedIn: false
});

  return (
      <Router>
          <div className="App-header">
              <Nav changeData={changeData} userData={userData}/>
              <Switch>
                  <Route exact path="/" component={Homepage}/>
                  <Route path="/about" component={About}/>
                  <Route path="/login" render={(props) => <Login changeData={changeData} userData={userData}/>}/>
                  <Route path="/sign-up" render={(props) => <CreateUser changeData={changeData} userData={userData}/>}/>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
