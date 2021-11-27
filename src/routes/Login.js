import { Link } from 'react-router-dom';
import React, {useState} from 'react';

function Login() {
    // TODO: this page should redirect to the dashboard if the user is authenticated
    
    const [state, setState] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }


    async function sendLogin() {

        const response = await fetch("http://localhost:5000/login",{
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
        return response.json();
    }

    return (
        <div>
            <h1>Login</h1>
            <div class="inputTitle">UCLA Email:</div>
            <div><input type="email" id="email" name="email" class="textbox" placeholder="joebruin@ucla.edu" value={state.email} onChange = {handleChange}/></div>
            <br></br>
            <div class="inputTitle">Password:</div>
            <div><input type="password" id="password" name="password" class="textbox" value={state.password} onChange = {handleChange}/></div>
            <div>
                <input type="checkbox" id="remember" name="remember" class="check"/>
                <label className="checktext">Remember Me</label>
            </div>
            <br></br>
            <br></br>
            <div><a className="switch" href="#" onClick={sendLogin}>Login</a></div>
            <br></br>
            <br></br>
            <div>New User?</div>
            <br/>
            <div><Link to="/register">Register Here.</Link></div>
        </div>
    );
}

export default Login;