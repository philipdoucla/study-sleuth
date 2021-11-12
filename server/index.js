const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({
            where: { email }
        });
        if (!user) {
            return done(null, false, { error: 'A user with that email does not exist.' });
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return done(null, false, { error: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((id, done) => {
    done(null, id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


app.get('/', (req, res) => {
    res.send('hello world');
});

app.post('/login', passport.authenticate('local'),
    async (req, res) => {
        // this function is only reached if login succeeded
        res.status(200).json(req.user);
    }
);

app.post('/register', async (req, res) => {
    const { email, password, passwordConfirm, firstName, lastName } = req.body;

    if (!email) {
        // TODO: check that email has ucla.edu domain
        return res.status(422).json({
            error: 'Email address must be provided'
        });
    }

    let user;
    try {
        user = await User.findOne({
            where: { email }
        });
    } catch (error) {
        return res.status(500).json({ error });
    }

    if (user) {
        return res.status(422).json({
            error: 'Email in use'
        });
    }

    if (password !== passwordConfirm) {
        return res.status(422).json({
            error: 'Passwords do not match'
        });
    }

    if (password.length < 6) {
        return res.status(422).json({
            error: 'Password should be at least 6 characters in length'
        });
    }

    if (!firstName || !lastName) {
        return res.status(422).json({
            error: 'First and last name must be provided'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await User.create({
            id: User.randomId(),
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        return res.status(200).json(newUser.toJSON());
    } catch (error) {
        return res.status(500).json({ error });
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
