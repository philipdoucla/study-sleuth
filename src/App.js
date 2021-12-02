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
        console.log("Logged out");
        fetch("http://localhost:5000/logout",{
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
        })
        this.props.updateLoggedIn();
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
                        <Link to="/dashboard">Dashboard</Link>
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
        this.state = {fname: "", lname: "", academicClass: "", major: null, residence: null, loggedIn: false, groupState: null};
        
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
            if(response.ok) {
                return response.json()
            }
            return Promise.reject(response);
        })
        .then((data) => {
                that.setState({
                fname: data.firstName,
                lname: data.lastName,
                academicClass: data.academicClass,
                major: data.major,
                residence: data.residence,
                groupState: data.groupState,
            })
        })
        .catch(() => {})
    }
    
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <NavBar loggedIn={this.state.loggedIn} updateLoggedIn={this.updateLoggedIn}/>
                    <Switch>
                        <Route path="/login">
                            <Login loggedIn={this.state.loggedIn} updateLoggedIn={this.updateLoggedIn}/>
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route path="/profile">
                            <Profile profile={this.state}/>
                        </Route>
                        <Route path="/findgroup">
                            <FindGroup loggedIn={this.state.loggedIn}/>
                        </Route>
                        <Route path="/dashboard">
                            <Dashboard profile={this.state} loggedIn={this.state.loggedIn} updateLoggedIn={this.updateLoggedIn}/>
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
