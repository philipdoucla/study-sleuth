import { ClassSearch } from '../AutoComplete.js'
import React, { useState } from 'react';
import { useHistory, Redirect } from "react-router-dom";

const Profile = ({loggedIn}) => {
    const history = useHistory();

    const [state, setState] = useState({
        class: "",
        major: "",
        residence: "",
        firstName: "",
        lastName: "",
        password: "",
        cPassword: "",
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
        await fetch("http://localhost:5000/login", { // correctly implement fetch later
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
                if (response.ok) {
                    history.push("/dashboard")
                } else {
                    return response.json()
                }
            })
            .then(data => {
                if (data) alert(data["error"])
            })
        setLoading(false);
    }


    if(!loggedIn) {
        return <Redirect to="/login"/>
    }

    return (
        <div onKeyPress={handleKeypress}>
            <h1>Profile</h1>
            <div className="inputTitle">Classes:</div>
            <div>
                <center name="class" value={state.class} onChange={handleChange}><ClassSearch /></center>
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
                    <option value="Rieber">Centennial Hall</option>
                    <option value="De Neve">De Neve Plaza</option>
                    <option value="De Neve">Dykstra Hall</option>
                    <option value="Hedrick">Hedrick Court</option>
                    <option value="Rieber">Olympic Hall</option>
                    <option value="Rieber">Rieber Court</option>
                    <option value="Sproul">Sproul Plaza</option>
                    <option value="Sproul">Sunset Village</option>
                    <option value="Hedrick">Appartments</option>
                </select>
            </div>
            <h1>Account</h1>
            <div className="inputTitle">First Name:</div>
            <div><input type="text" name="firstName" className="textbox" placeholder="Joe" value={state.firstName} onChange={handleChange} /><br /></div>
            <div className="inputTitle">Last Name:</div>
            <div><input type="text" name="lastName" className="textbox" placeholder="Bruin" value={state.lastName} onChange={handleChange} /><br /></div>
            <br />
            <div><a className="switch" href="#" onClick={sendInfo}>{!loading ? "Save Profile" : "Loading..."}</a></div>
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}

export default Profile;