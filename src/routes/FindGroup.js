import { Link } from 'react-router-dom';
import React, {useState} from 'react';
import { useHistory } from "react-router-dom";

function FindGroup() {
    // replicated the structure of Login.js
        // probably needs much fixing
    const history = useHistory();
    
    const [state, setState] = useState({
        groupSize: "",
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
        if(e.key === "Enter") {
            sendSearch();
        }
    }

    // don't fully understand, must revise later
    async function sendSearch() {
        setLoading(true);
        const response = await fetch("http://localhost:5000/login",{
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
        if(response.status === 200) {
            history.push("/dashboard");
        } else {
            history.push("/login");
        }
        setLoading(false);
        return response.status;
    }


    return (
        <div onChange={handleKeypress}>
            <h1>Sleuthing for a Sleuth</h1>
            <div class="inputTitle">Preferred Group Size:</div>
            <div>
                <select name="size" className="selector" value={state.groupSize} onChange={handleChange}>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5" selected>5</option>
                </select>
            </div>
            <br></br>
            <div class="inputTitle">Friends?</div>
            <div><input type="text" className="textbox" value={state.friendCode} onChange={handleChange}/></div>
            <br></br>
            <div><Link to="/dashboard" className="switch">Start Sleuthing!</Link></div>
        </div>
    );
}

export default FindGroup;