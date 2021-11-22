import { Link } from 'react-router-dom';
import React from 'react';
import './AutoCompleteText.css';

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

class ClassSearch extends React.Component {
        constructor() {
            super();
            this.state = {
                suggestions: [],
                academicClasses: [],
                text : '',
            };
        }

        componentWillMount = async () => {
            let departments = []
            await fetch("https://api.ucla.edu/sis/publicapis/course/getallcourses")
                .then(response => response.json())
                .then(data => {
                    for(var i in data) {
                        departments.push(data[i]["subj_area_cd"]);
                    }
                })
            
            var classes_list = [];
            for(var i in departments) {
                console.log(classes_list.length);
                await fetch('https://api.ucla.edu/sis/publicapis/course/getcoursedetail?subjectarea=' + departments[i])
                    .then(response => response.json())
                    .then(data => {
                        for(var j in data) {
                            classes_list.push(data[j]["subj_area_cd"] + [data[j]["course_title"]]);
                        }
                    });
                if (classes_list.length > this.state.academicClasses.length)
                    this.setState({academicClasses: classes_list,}); 
            }

        }

        onTextChanged = (e) => {
            const value = e.target.value;
            let suggestions = [];
            if (value.length > 0) {
                const regex = new RegExp(`${value}`, 'i');
                suggestions = this.state.academicClasses.sort().filter(v => regex.test(v));
                console.log(suggestions)
            }
            console.log(suggestions);
            this.setState(() => ({suggestions, text:value}));
        }

        renderSuggestions () {
            const { suggestions } = this.state;
            let local_suggestions = suggestions;
            if (local_suggestions.length === 0) {
                return null;
            }
            if (local_suggestions.length > 10) {
                local_suggestions = suggestions.slice(0, 10);
            }
            return (
                <ul>
                    {local_suggestions.map((item) => <li onClick={() => this.suggestionSelected(item)}>{item}</li>)}
                </ul>
            );
        }

        suggestionSelected (value) {
            this.setState(() => ({
                text: value,
                suggestions: [],
            }));
        }

        render () {
            const { text } = this.state;
            return (
            <div className="AutoCompleteText">
                <input value={text} onChange={this.onTextChanged} type="text"/>
                {this.renderSuggestions()}
            </div>
            );

        }
    }


export default Profile;