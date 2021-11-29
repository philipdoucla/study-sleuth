import { Link } from 'react-router-dom';
import {ClassSearch} from '../AutoComplete.js'

function Profile() {
    // TODO: 
    // 1) the class select bar needs to be adding/removing from list of classes, not just one
    // 2) need more comprehensive lists

    return (
        <div>
        <h1>Profile</h1>
        <div className="inputTitle">Classes:</div>
        <div>
            <center><ClassSearch /></center>
        </div>
        <div className="inputTitle">Major:</div>
        <div>
            <select name="major" className="selector">
                <option value="CS">Computer Science</option>
                <option value="CE">Computer Engineering</option>
                <option value="CSE">Computer Science and Engineering</option>
            </select>
        </div>
        <div className="inputTitle">Residence:</div>
        <div>
            <select name="residence" className="selector">
                <option value="centennial">Centennial Hall</option>
                <option value="de_neve">De Neve Plaza</option>
                <option value="dykstra">Dykstra Hall</option>
                <option value="hedrick">Hedrick Court</option>
                <option value="olympic">Olympic Hall</option>
                <option value="rieber">Rieber Court</option>
                <option value="sproul">Sproul Plaza</option>
                <option value="sunset">Sunset Village</option>
                <option value="appartments">Appartments</option>
            </select>
        </div>
        <h1>Account</h1>
        <div class="inputTitle">First Name:</div>
        <div><input type="text" className="textbox" placeholder="Joe"/><br></br></div>
        <div class="inputTitle">Last Name:</div>
        <div><input type="text" className="textbox" placeholder="Bruin"/><br></br></div>
        <div class="inputTitle">Password:</div>
        <div><input type="text" className="textbox"/><br></br></div>
        <div class="inputTitle">Confirm Password:</div>
        <div><input type="text" className="textbox"/><br></br></div>
        <br></br>
        <div><Link to="/dashboard" className="switch">Save</Link></div>
        </div>
    );
}




export default Profile;