import { Link } from 'react-router-dom';

function FindGroup() {
    return (
        <div>
        <h1>Sleuthing for a Sleuth</h1>
        <div class="inputTitle">Preferred Group Size:</div>
        <div>
            <select name="size">
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>   
            </select>
        </div>
        <br></br>
        <div class="inputTitle">Friends?</div>
        <div><input type="text" class="textbox"/></div>
        <br></br>
        <div><Link to="/dashboard" class="switch">Start Sleuthing!</Link></div>
        </div>
    );
}

export default FindGroup;