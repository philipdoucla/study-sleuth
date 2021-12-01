import { Link, Redirect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


class Dashboard extends React.Component {
    // TODO: needs to actually display data and junk
    // the findgroup login must save account login

    constructor(props) {
        super(props);
        this.state = {
            groupSize: 0,
            memberName: [],
            memberID: [],
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
            //body: JSON.stringify(state)
        })
        .then((response) => response.json())
        .then(data => {
            this.setState({groupSize: data.groupmates.length})
            
            let tempMemberName = data.groupmates.map(function(user) {
                return user.firstName;
            })
            this.setState({ memberName: [...this.state.memberName, ...tempMemberName ] })

            let tempMemberLName = data.groupmates.map(function(user) {
                return user.lastName;
            })
            for(let i = 0; i < this.state.groupSize; i++) {
                this.state.memberName[i] = ( [this.state.memberName[i], tempMemberLName[i]].join(' '))
            }

            let tempMemberID = data.groupmates.map(function(user) {
                return user.id;
            })
            this.setState({ memberID: [...this.state.memberID, ...tempMemberID ] })

        })
        .then(
            console.log('updated?')
        )
        .catch((error) => {
            console.error('Error:', error);
          })
        
      }

    render(){
        const {loggedIn} = this.props;

        if(!loggedIn) {
            return (<Redirect to="login"/>)
        }

        return(
            console.log('render' + this.state.groupSize + this.state.memberName[0]),
            // will need to display group data dynamically
            <div>
                <h1>Dashboard</h1>
                <div className="GroupTitle">Your Study Sleuth:</div>
                <div>
                    <ul id="memberList" className="grouplist">
    
                    {(this.state.memberName || []).map(item => (
                     <li key={item}>{item}</li>
                    ))}

                    </ul>
                </div>
                <br />
                <div><button type="button" className="switch">Rate Your Group</button></div>
                <br />
                <div><Link to="/findgroup" className="switch">Find New Group</Link></div>
            </div>
        );
    }
}

export default Dashboard;