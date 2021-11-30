import { BrowserRouter, Switch, Route, Link, useLocation } from 'react-router-dom';
import Home from './routes/Home.js';
import Login from './routes/Login.js';
import Register from './routes/Register.js';
import Profile from './routes/Profile.js';
import FindGroup from './routes/FindGroup.js';
import Dashboard from './routes/Dashboard.js';
import './App.css';
import logo from './study-sleuth-icon-banner.png';
import React, { useState, useEffect } from 'react';

function NavBar() {
    if(useLocation().pathname !== "/dashboard")
    {
        return (
            <header className="App-header">
                <div className="App-header-left">
                    <a href="/">
                        <img className="logo" src={logo} />
                    </a>
                </div>
                <div className="App-header-right">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </header>
        );
    }
    else
    {
        return (
            <header className="App-header">
                <div className="App-header-left">
                    <a href="/">
                        <img className="logo" src={logo} />
                    </a>
                </div>
                <div className="App-header-right">
                    <Link to="/login">Logout</Link>
                </div>
            </header>
        );
    }
}
class App extends React.Component {
    
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <NavBar />
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route path="/profile">
                            <Profile />
                        </Route>
                        <Route path="/findgroup">
                            <FindGroup />
                        </Route>
                        <Route path="/dashboard">
                            <Dashboard />
                        </Route>
                        {/* must come last because of pattern matching */}
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </div>
        </BrowserRouter>
    );
    }
}

export default App;
