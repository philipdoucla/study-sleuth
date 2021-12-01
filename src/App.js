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

class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }

    logout() {
        fetch("http://localhost:5000/logout",{
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
        })
    }

    render() {
        if(!this.props.loggedIn)
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
                        <Link to="/profile">Profile</Link>
                        <a href="/login" onClick={this.logout}>Logout</a>
                    </div>
                    </header>
            );
        }
    }
    
}
class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {fname: "", lname: "", major: null, residence: null, loggedIn: false};
        
    }
    componentWillMount(){
        this.updateLoggedIn();
    }
    updateLoggedIn = async () => {
        const that = this;
        await fetch('http://localhost:5000/me',{
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',}
            )
        .then(async response => {
            that.setState({loggedIn: response.ok});
            return response.json()
        })
        .then(data => {
            console.log(data);
        })
    }
    
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <NavBar loggedIn={this.state.loggedIn}/>
                    <Switch>
                        <Route path="/login">
                            <Login updateLoggedIn={this.updateLoggedIn}/>
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route path="/profile">
                            <Profile loggedIn={this.state.loggedIn}/>
                        </Route>
                        <Route path="/findgroup">
                            <FindGroup loggedIn={this.state.loggedIn}/>
                        </Route>
                        <Route path="/dashboard">
                            <Dashboard loggedIn={this.state.loggedIn}/>
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
