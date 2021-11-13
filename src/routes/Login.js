import { Link } from 'react-router-dom';

function Login() {
    // TODO: this page should redirect to the dashboard if the user is authenticated
    return (
        <div>
        <h1>Login</h1>
        <div class="inputTitle">UCLA Email:</div>
        <div><input type="text" class="textbox" placeholder="joebruin@ucla.edu"/></div>
        <br></br>
        <div class="inputTitle">Password:</div>
        <div><input type="text" class="textbox"/></div>
        <div><input type="checkbox" class="check"/>Remember Me</div>
        <br></br>
        <br></br>
        <div><Link to="/dashboard" class="switch">Login</Link></div>
        <br></br>
        <br></br>
        <div>New User?</div>
        <div><Link to="/register">Register Here.</Link></div>
        </div>
    );
}

export default Login;