import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

function Login({updateLoggedIn}) {
    // TODO: this page should redirect to the dashboard if the user is authenticated
    const history = useHistory();

    const [state, setState] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const handleKeypress = e => {
        if (e.key === "Enter") {
            sendLogin();
        }
    }

    async function sendLogin() {
        setLoading(true);
        await fetch("http://localhost:5000/login", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(state)
        })
        .then(response => {
            updateLoggedIn()
            .then( () => {
            if(response.ok) {
                history.push("/dashboard");
            } else {
                return response.json();
            }
            })
            .then(data => {
                if(data) alert(data["error"])
            })
        })
        setLoading(false);
    }

    return (
        <div onKeyPress={handleKeypress}>
            <h1>Login</h1>
            <div className="inputTitle">UCLA Email:</div>
            <div><input type="email" id="email" name="email" className="textbox" placeholder="joebruin@ucla.edu" value={state.email} onChange={handleChange} /></div>
            <br />
            <div className="inputTitle">Password:</div>
            <div><input type="password" id="password" name="password" className="textbox" value={state.password} onChange={handleChange} /></div>
            <br/>
            <div>
                <input type="checkbox" id="remember" name="remember" className="check" />
                <label className="checktext">Remember Me</label>
            </div>
            <br />
            <br />
            <div><a className="switch" href="#" onClick={sendLogin}>{!loading ? "Login" : "Loading..."}</a></div>
            <br />
            <br />
            <div>New User?</div>
            <br />
            <div><Link to="/register">Register Here.</Link></div>
        </div>
    );
}

export default Login;