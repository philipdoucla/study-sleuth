import { Link } from 'react-router-dom';

function Login() {
    // TODO: this page should redirect to the dashboard if the user is authenticated
    return (
        <div>
            <h1>Login</h1>
            <div class="inputTitle">UCLA Email:</div>
            <div><input type="text" className="textbox" placeholder="joebruin@ucla.edu" /></div>
            <br></br>
            <div class="inputTitle">Password:</div>
            <div><input type="password" className="textbox" /></div>
            <div>
                <input type="checkbox" className="check" />
                <label className="checktext">Remember Me</label>
            </div>
            <br></br>
            <br></br>
            <div><Link to="/dashboard" className="switch">Login</Link></div>
            <br></br>
            <br></br>
            <div>New User?</div>
            <br/>
            <div><Link to="/register">Register Here.</Link></div>
        </div>
    );
}

export default Login;