import { ClassSearch } from '../AutoComplete.js'
import React, { useState } from 'react';
import { useHistory, Redirect } from "react-router-dom";

const Profile = ({loggedIn}) => {
    const history = useHistory();

    const [state, setState] = useState({
        academicClass: "",
        major: "",
        residence: "",
        firstName: "",
        lastName: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const handleKeypress = e => {
        if (e.key === "Enter") {
            sendInfo();
        }
    }

    async function sendInfo() {
        setLoading(true);
        console.log(state);
        await fetch("http://localhost:5000/profile", { // correctly implement fetch later
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(state)
        })
        .then(async response => {
            console.log(response);
            if (response.ok) {
                <Redirect to="profile"/>
            } else {
                return response.json()
            }
        })
        .then(error => {
            alert(error["error"]);
        })
        setLoading(false);
    }


    if(!loggedIn) {
        return <Redirect to="/login"/>
    }

    return (
        <form onKeyPress={handleKeypress} onSubmit={sendInfo}>
            <h1>Profile</h1>
            <div className="inputTitle">Classes:</div>
            <div>
                <center name="class" value={state.academicClass} onChange={handleChange}><ClassSearch /></center>
            </div>
            <div className="inputTitle">Major:</div>
            <div>
                <select name="major" className="selector" value={state.major} onChange={handleChange}>
                    <option value="CS">Computer Science</option>
                    <option value="CE">Computer Engineering</option>
                    <option value="CSE">Computer Science and Engineering</option>
                </select>
            </div>
            <div className="inputTitle">Residence:</div>
            <div>
                <select name="residence" className="selector" value={state.residence} onChange={handleChange}>
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
            <div className="inputTitle">First Name:</div>
            <div><input type="text" name="firstName" className="textbox" placeholder="Joe" value={state.firstName} onChange={handleChange} /><br /></div>
            <div className="inputTitle">Last Name:</div>
            <div><input type="text" name="lastName" className="textbox" placeholder="Bruin" value={state.lastName} onChange={handleChange} /><br /></div>
            <br />
            <div><input className="switch" type="submit" value={!loading ? "Save Profile" : "Loading..."}/></div>
            <br />
            <br />
            <br />
            <br />
            <br />
        </form>
    );
}

export default Profile;