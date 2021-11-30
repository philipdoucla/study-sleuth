import { Link } from 'react-router-dom';

function Dashboard() {
    // TODO: needs to actually display data and junk
    // the findgroup login must save account login
    return (
        // will need to display group data dynamically
        <div>
            <h1>Dashboard</h1>
            <div className="inputTitle">Your Study Sleuth:</div>
            <div>
                <ul className="grouplist">
                    <li>Philip Do</li>
                    <li>Derek Le</li>
                    <li>Vinh Nguyen</li>
                    <li>James Shiffer</li>
                    <li>Dhaval Vora</li>
                </ul>
            </div>
            <br />
            <div><button type="button" className="switch">Rate Your Group</button></div>
            <br />
            <div><Link to="/findgroup" className="switch">Find New Group</Link></div>
        </div>
    );
}

export default Dashboard;