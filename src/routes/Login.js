import { Link } from 'react-router-dom';

function Login() {
    // TODO: this page should redirect to the dashboard if the user is authenticated
    return (
        <div>
        <h1>Login</h1>
        <div>UCLA Email:</div>
        <div><input type="text" class="textbox"/></div>
        <div>Password:</div>
        <div><input type="text" class="textbox"/></div>
        <div><input type="checkbox"/>Remember Me</div>
        <br></br>
        <div><button type="button">Login</button></div>
        <br></br>
        <div><Link to="/dashboard">Go to Dashboard.</Link></div>
        <br></br>
        <div>New User?</div>
        <div><Link to="/register">Register Here.</Link></div>
        </div>
    );
}

export default Login;