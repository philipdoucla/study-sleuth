import icon from '../study-sleuth-logo.png';

function Home() {
    // TODO: this route should show a dashboard page instead when the user is authenticated
    return (
        <div>
        <h1>About Us</h1>
        <div>
            <span>
                <img className="icon" align="left" src={icon} />
            </span>
            <span>
                <br/>
                <br/>
                <br/>
                <p className="description">Lost in your classes? Too lazy to work on assignments? Need to study for exams?</p>
                <p className="description">Listen, school's a tough time, and working out that brain all by yourself is just extra weight on your shoulders.
                So look no further than Study Sleuth, your all-encompassing web app for finding a study group at UCLA.
                Life is already hard enough on the Hill so hear me out and give Study Sleuth a shot. Sign up, put in your info, and we'll find you a group of students in the same course to study and work with.
                If you're not still satisfied then we'll give you a 80% refund (of this free service). All the cool kids are doing it these days, so you should too.
                We hope your Sleuth* has a great experience studying with each other while having some fun along the way.</p>
                <br></br>
                <p className="description">*Sleuth: a group of Bruins!</p>
            </span>
        </div>
        </div>
    );
}

export default Home;