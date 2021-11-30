import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

function FindGroup() {
    // replicated the structure of Login.js
    const history = useHistory();

    const [state, setState] = useState({
        groupSize: 5,
        friendCode: "",
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
            sendSearch();
        }
    }

    async function sendSearch() {
        setLoading(true);
        await fetch("http://localhost:5000/login", { // correctly implement later
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

    return (
        <div onChange={handleKeypress}>
            <h1>Sleuthing for a Sleuth</h1>
            <div className="inputTitle">Preferred Group Size:</div>
            <div>
                <select name="groupSize" className="selector" value={state.groupSize} onChange={handleChange}>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5" selected>5</option>
                </select>
            </div>
            <br />
            <div className="inputTitle">Friends?</div>
            <div><input type="text" name="friendCode" className="textbox" value={state.friendCode} onChange={handleChange} /></div>
            <br />
            <div><a className="switch" href="#" onClick={sendSearch}>{!loading ? "Start Sleuthing!" : "Loading..."}</a></div>
        </div>
    );
}

export default FindGroup;