import { Link } from 'react-router-dom';

function Register() {
    // TODO: this page should redirect to the dashboard if the user is authenticated
    return (
        <div>
        <h1>Register</h1>
        <div class="inputTitle">First Name:</div>
        <div><input type="text" className="textbox" placeholder="Joe"/></div>
        <br></br>
        <div class="inputTitle">Last Name:</div>
        <div><input type="text" className="textbox" placeholder="Bruin"/></div>
        <br></br>
        <div class="inputTitle">UCLA Email:</div>
        <div><input type="email" className="textbox" placeholder="joebruin@ucla.edu"/></div>
        <br></br>
        <div class="inputTitle">Password:</div>
        <div><input type="text" className="textbox"/></div>
        <br></br>
        <div class="inputTitle">Confirm Password:</div>
        <div><input type="text" className="textbox"/></div>
        <br></br>
        <div><Link to="/profile" className="switch">Register</Link></div>
        <br></br>
        <br></br>
        <div>Returning User?</div>
        <br/>
        <div><Link to="/login">Login Here.</Link></div>
        </div>
    );
}

export default Register;