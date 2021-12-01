import { Link, Redirect } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component'
import React, { useState } from 'react';
const Dashboard = ({loggedIn}) => {
    // TODO: needs to actually display data and junk
    // the findgroup login must save account login

    const [showRating, setShow] = useState(false);

    if(!loggedIn) {
        return (<Redirect to="login"/>)
    }

    const updateRating = (newRating) => {
        console.log("Hi: " + newRating);
    }

    const groupMember = (memberName, showRating) => {
        return (
            <li>{memberName}{showRating ? <ReactStars count={5} onChange={updateRating} size={24} activeColor="#ffd700"/> : null}</li>
        )
    }

    const ratingButton = () => {
        if(!showRating) {
            return (<button type="button" className="switch" onClick={() => setShow(true)}>Rate Your Group</button>)
        }
        return (<button type="button" className="switch" onClick={() => {setShow(false); saveRatings()}}>Save</button>)
    }

    const saveRatings = () => {
        console.log("hi");
    }


    return (
        // will need to display group data dynamically
        <div>
            <h1>Dashboard</h1>
            <div className="GroupTitle">Your Study Sleuth:</div>
            <div>
                <ul className="grouplist">
                    {groupMember("Philip Do", showRating)}
                    {groupMember("Derek Lee", showRating)}
                    {groupMember("James Shiffer", showRating)}
                    {groupMember("Vinh Ngyuen", showRating)}
                    {groupMember("Dhaval Vora", showRating)}
                </ul>
            </div>
            <br />
            <div>{ratingButton()}</div>
            <br />
            <div><Link to="/findgroup" className="switch">Find New Group</Link></div>
        </div>
    );
}

export default Dashboard;