import { Link } from 'react-router-dom';

function Dashboard() {
    // TODO: needs to actually display data and junk
    return (
        <div>
        <h1>Dashboard</h1>
        <div class="inputTitle">Your Study Sleuth:</div>
        <div>
            <ul>
                <li>Philip Do</li>
                <li>Derek Le</li>
                <li>Vinh Nguyen</li>
                <li>James Shiffer</li>
                <li>Dhaval Vora</li>
            </ul>
        </div>
        <br></br>
        <div><button type="button" class="switch">Rate Your Group</button></div>
        <br></br>
        <div><Link to="/findgroup" class="switch">Find New Group</Link></div>
        </div>
    );
}

export default Dashboard;