import { ClassSearch } from '../AutoComplete.js'
import React, { useState, useEffect, useCallback,useRef } from 'react';
import { useHistory, Redirect } from "react-router-dom";

const Profile = ({ profile }) => {
    const history = useHistory();

    const [state, setState] = useState({
        academicClass: "",
        major: "",
        residence: "",
        firstName: "",
        lastName: "",
    });
    const stateRef = useRef({});
    stateRef.current = state

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setState({
            ...stateRef.current,
            [e.target.name]: e.target.value
        });
    }

    const updateClass = useCallback((newClass) => {
        setState({...stateRef.current,
            academicClass: newClass
        });
    }, []);

    const handleKeypress1 = e => {
        if (e.key === "Enter") {
            sendInfo();
        }
    }

    async function sendInfo() {
        setLoading(true);
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
            body: JSON.stringify(stateRef.current)
        })
        .then(async response => {
            if (response.ok) {
                history.push("/profile");
            } else {
                alert(response.json()["error"])
            }
        })
        setLoading(false); 
    }

    // code for password changes starts here
    const [pw, setPassword] = useState({
        password: "",
        newPassword: "",
        cNewPassword: "",
    });

    const handlePassword = (e) => {
        setPassword({
            ...pw,
            [e.target.name]: e.target.value
        });
        
    }

    async function sendPassword() {
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

    const handleKeypress2 = e => {
        if (e.key === "Enter") {
            sendPassword();
        }
    }

    useEffect(() => {

        if(!profile) {
            setState({...state})
        }


        let majors = ["Computer Science", "Computer Science and Engineering", "Computer Engineering"]
        setState({...state,
            academicClass: profile.academicClass,
            major: majors[profile.major],
            residence: "Rieber",
            firstName: profile.fname,
            lastName: profile.lname,
        })
    }, []);



    // code for display stuff starts here
    if (!profile.loggedIn) {
        return <Redirect to="/login" />
    }

    return (
        <div>
            <div onKeyPress={handleKeypress1}>
                <h1>Profile</h1>
                <div className="inputTitle">Classes:</div>
                <div>
                    <center><ClassSearch text={profile.academicClass} updateClass={updateClass}/></center>
                </div>
                <div className="inputTitle">Major:</div>
                <div>
                    <select name="major" className="selector" value={state.major} onChange={handleChange}>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Computer Science and Engineering">Computer Science and Engineering</option>
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
            </div>
            <div onKeyPress={handleKeypress2}>
                <div className="inputTitle">Current Password:</div>
                <div><input type="password" name="password" className="textbox" value={pw.password} onChange={handlePassword} /><br /></div>
                <div className="inputTitle">New Password:</div>
                <div><input type="password" name="newPassword" className="textbox" value={pw.newPassword} onChange={handlePassword} /><br /></div>
                <div className="inputTitle">Confirm New Password:</div>
                <div><input type="password" name="cNewPassword" className="textbox" value={pw.cNewPassword} onChange={handlePassword} /><br /></div>
                <br />
                <div><a className="switch" href="#" onClick={sendPassword}>{!loading ? "Save Password" : "Loading..."}</a></div>
                <br />
                <br />
                <br />
                <br />
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}
export default Profile;