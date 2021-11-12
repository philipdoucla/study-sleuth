import { Link } from 'react-router-dom';

function Dashboard() {
    // TODO: needs to actually display data and junk
    return (
        <div>
        <h1>Dashboard</h1>
        <div>Your Study Sleuth:</div>
        <div>
            <ul>
                <li>Philip Do</li>
                <li>Derek Le</li>
                <li>Vinh Nguyen</li>
                <li>James Shiffer</li>
                <li>Dhaval Vora</li>
            </ul>
        </div>
        <div><button type="button">Rate Your Group</button></div>
        <br/>
        <div><Link to="/findgroup">Find New Group</Link></div>
        </div>
    );
}

export default Dashboard;