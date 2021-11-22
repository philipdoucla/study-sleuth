import { Link } from 'react-router-dom';
import {ClassSearch} from '../AutoComplete.js'

function Profile() {
    // TODO: 
    // 1) the class select bar needs to be adding/removing from list of classes, not just one
    // 2) need more comprehensive lists

    return (
        <div>
        <h1>Profile</h1>
        <div class="inputTitle">Classes:</div>
        <div>
            <center><ClassSearch /></center>
        </div>
        <div class="inputTitle">Major:</div>
        <div>
            <select name="major">
                <option value="CS">Computer Science</option>
                <option value="CE">Computer Engineering</option>
                <option value="CSE">Computer Science and Engineering</option>
            </select>
        </div>
        <div class="inputTitle">Residence:</div>
        <div>
            <select name="residence">
                <option value="sproul">Sproul Hall</option>
                <option value="de neve">De Neve Hall</option>
                <option value="hedrick">Hedrick Hall</option>
                <option value="rieber">Rieber Hall</option>
            </select>
        </div>
        <h1>Account</h1>
        <div class="inputTitle">First Name:</div>
        <div><input type="text" class="textbox" placeholder="Joe"/><br></br></div>
        <div class="inputTitle">Last Name:</div>
        <div><input type="text" class="textbox" placeholder="Bruin"/><br></br></div>
        <div class="inputTitle">Password:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <div class="inputTitle">Confirm Password:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <br></br>
        <div><Link to="/dashboard" class="switch">Save</Link></div>
        </div>
    );
}




export default Profile;