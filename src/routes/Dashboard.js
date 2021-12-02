import { Link, Redirect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ReactStars from 'react-rating-stars-component'

class Dashboard extends React.Component {
    // TODO: needs to actually display data and junk
    // the findgroup login must save account login

    constructor(props) {
        super(props);
        this.state = {
            members: [],
            showRating: false,
            starCount: 0
        };
    }

    componentDidMount() {
        fetch("http://localhost:5000/group", {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
        .then((response) => response.json())
        .then(data => {
            this.setState({
                members: data.groupmates
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
      
    ratingButton = () => {
        if(!this.state.showRating) {
            return (<button type="button" className="switch" onClick={() => {this.setState({showRating: true})}}>Rate Your Group</button>);
        }
        return (<button type="button" className="switch" onClick={() => {this.setState({showRating: false})}}>Save</button>);
    }

    leaveGroup =() => {
        fetch("http://localhost:5000/leaveGroup", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
        })
        .then( ()=> {
            return <Redirect to="/dashboard"/>
        }
        );
    }


    render(){
        const {loggedIn} = this.props;

        if(!loggedIn) {
            return (<Redirect to="login"/>)
        }

        return(
            // will need to display group data dynamically
            <div>
                <h1>Dashboard</h1>
                <div className="GroupTitle">Your Study Sleuth:</div>
                <div>
                    <ul id="memberList" className="grouplist">
    
                    {(this.state.members || []).map((item, i) => (
                        <Member data={item} showRating={this.state.showRating} key={i} />
                    ))}

                    </ul>
                </div>
                <br />
                <div>{this.ratingButton()}</div>
                <br />
                <div><Link to="/findgroup" className="switch">Find New Group</Link></div>
                <br />
                <div><button type="button" href="#" className="switch" onClick={this.leaveGroup}> Leave Group </button></div>
            </div>
        );
    }
}

function Member(props) {
    const memberName = props.data.firstName + ' ' + props.data.lastName;

    const onRated = newRating => {
        fetch('http://localhost:5000/rateUser', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                redirect: 'follow',
                referrerPolicy: 'no-referrer'
            },
            body: JSON.stringify({
                target: props.data.id,
                value: newRating
            })
        })
        .then(() => {
            console.log(`Rated user ${props.data.id} with ${newRating} stars`)
        });
    };

    return (
        <li className="groupMember">
            <div>{memberName}:</div>
            <div><a className="emailDisplay" href={`mailto:${props.data.email}`}>{props.data.email}</a></div>
            <div className="ratingstar">
                {props.showRating ? <ReactStars count={5} onChange={onRated} size={24} activeColor="#ffd700" /> : null}
            </div>
        </li>
    );
}

export default Dashboard;


/*


    

    


*/