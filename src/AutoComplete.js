import React from 'react';
import './AutoCompleteText.css';

class AutoComplete extends React.Component {
    constructor() {
        super();
        this.state = {
            suggestions: [],
            autocomplete: [],
            text : '',
        };
    }
    componentWillMount = () => {
        throw new Error("Abstract Class")
    }

    onTextChanged = (e) => {
        const value = e.target.value;
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`${value}`, 'i');
            suggestions = this.state.autocomplete.sort().filter(v => regex.test(v));
        }
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


class ClassSearch extends AutoComplete {
    componentWillMount = async () => {
        let classes_list = [];
        await fetch("https://api.ucla.edu/sis/publicapis/course/getallcourses")
            .then(response => response.json())
            .then(data => {
                for(let i in data)
                    fetch('https://api.ucla.edu/sis/publicapis/course/getcoursedetail?subjectarea=' + data[i]["subj_area_cd"])
                    .then(response => response.json())
                    .then(data => {
                        for(var j in data)
                            classes_list.push(data[j]["subj_area_cd"].trim() +  " " + [data[j]["course_title"]]);
                        if (classes_list.length > this.state.autocomplete.length)
                            this.setState({autocomplete: classes_list,}); 
                    })
            })
    }
}

export {ClassSearch};