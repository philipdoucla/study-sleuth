import { Link } from 'react-router-dom';
import {useState} from 'react'
import { useHistory } from "react-router-dom";

function Register() {
    // TODO: this page should redirect to the dashboard if the user is authenticated
    const history = useHistory();

    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
    })

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    async function sendRegister() {

        const response = await fetch("http://localhost:5000/register",{
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
        if(response.status === 200) {
            history.push("/profile")
        } else {
            history.push("/register")
        }

        return response.json();
    }


    return (
        <div>
        <h1>Register</h1>
        <div class="inputTitle">First Name:</div>
        <div><input type="text" className="textbox" name="firstName" onChange={handleChange}placeholder="Joe"/></div>
        <br></br>
        <div class="inputTitle">Last Name:</div>
        <div><input type="text" className="textbox" name="lastName" onChange={handleChange} placeholder="Bruin"/></div>
        <br></br>
        <div class="inputTitle">UCLA Email:</div>
        <div><input type="email" className="textbox" name="email" onChange={handleChange} placeholder="joebruin@ucla.edu"/></div>
        <br></br>
        <div class="inputTitle">Password:</div>
        <div><input type="password" className="textbox" name="password" onChange={handleChange}/></div>
        <br></br>
        <div class="inputTitle">Confirm Password:</div>
        <div><input type="password" className="textbox" name="passwordConfirm" onChange={handleChange}/></div>
        <br></br>
        <div><a href="#" className="switch" onClick={sendRegister}>Register</a></div>
        <br></br>
        <br></br>
        <div>Returning User?</div>
        <br/>
        <div><Link to="/login">Login Here.</Link></div>
        </div>
    );
}

export default Register;