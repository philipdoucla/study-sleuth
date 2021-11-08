import { Link } from 'react-router-dom';

function Dashboard() {
    // TODO: needs to actually display data and junk
    return (
        <div>
        <h1>Dashboard</h1>
        <div>Your Study Sleuth:</div>
        <br/>
        <div>Password:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <div><input type="checkbox"/>Remember Me</div>
        <br></br>
        <div><button type="button">Rate Your Group</button></div>
        <br/>
        <div><Link to="/find">Find New Group</Link></div>
        </div>
    );
}

export default Dashboard;