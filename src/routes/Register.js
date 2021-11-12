import { Link } from 'react-router-dom';
//import './page.css';

function Register() {
    // TODO: this page should redirect to the dashboard if the user is authenticated
    return (
        <div>
        <h1>Register</h1>
        <div>First Name:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <div>Last Name:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <div>UCLA Email:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <div>Password:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <div>Confirm Password:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <br></br>
        <div><button type="button">Register</button></div>
        <br></br>
        <div>Returning User?</div>
        <div><Link to="/login">Login Here.</Link></div>
        </div>
    );
}

export default Register;