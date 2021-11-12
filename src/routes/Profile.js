import { Link } from 'react-router-dom';

function Profile() {
    // TODO: 
    // 1) the class select bar needs to be adding/removing from list of classes, not just one
    // 2) need more comprehensive lists
    return (
        <div>
        <h1>Profile</h1>
        <div>Classes:</div>
        <div>
            <select name="class"> 
                <option value="CS35L">CS35L - Software Construction</option>
                <option value="CS31">CS31 - Intro to Com. Sci. I</option>
            </select>
        </div>
        <div>Major:</div>
        <div>
            <select name="major">
                <option value="CS">Computer Science</option>
                <option value="CE">Computer Engineering</option>
                <option value="CSE">Computer Science and Engineering</option>
            </select>
        </div>
        <div>Residence:</div>
        <div>
            <select name="residence">
                <option value="sproul">Sproul Hall</option>
                <option value="de neve">De Neve Hall</option>
                <option value="hedrick">Hedrick Hall</option>
                <option value="rieber">Rieber Hall</option>
            </select>
        </div>
        <h1>Account</h1>
        <div>First Name:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <div>Last Name:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <div>Password:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <div>Confirm Password:</div>
        <div><input type="text" class="textbox"/><br></br></div>
        <br></br>
        <div><button type="button">Save</button></div>
        <br></br>
        <div><Link to="/dashboard">Dashboard</Link></div>
        </div>
    );
}

export default Profile;