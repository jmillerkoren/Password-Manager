import React from 'react';
import './App.css';
import Nav from './Navbar/nav'
import Homepage from "./Homepage/Homepage";
import Login from './Login/Login';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import About from "./About/About";

function App() {
  return (
      <Router>
          <div className="App-header">
              <Nav/>
              <Switch>
                  <Route exact path="/" component={Homepage}/>
                  <Route path="/about" component={About}/>
                  <Route path="/login" component={Login}/>
                  <Route path="/account" component={Login}/>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
