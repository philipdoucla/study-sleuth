/**
 * auth.js
 * Passport authentication code, API endpoints relating to auth
 */
const bcrypt = require("bcrypt");
const express = require("express");
const { Strategy: LocalStrategy } = require("passport-local");
const passport = require('passport');
const { User } = require('./db');
const { isValidEmail, isValidPassword } = require("../shared/validation.js");

/* Passport */
function initPassport() {
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            async (email, password, done) => {
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
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({where: { id }});
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}

/* Middleware */
function authenticated(req, res, next) {
    if (!req.session || !req.user) {
        return res.status(401).json({
            error: 'You must be logged in.'
        });
    } else {
        return next();
    }
}

/* Express */
const routes = express.Router();

routes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send(info);
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json(user);
        });
    })(req, res, next)
});

routes.post('/logout', authenticated, async (req, res) => {
    req.logout();
    return res.json({});
});

routes.post('/register', async (req, res) => {
    const { email, password, passwordConfirm, firstName, lastName } = req.body;
    if (!email || !isValidEmail(email)) {
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

    if (!isValidPassword(password)) {
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
});

routes.get('/me', authenticated, async (req, res) => {
    return res.status(200).json(req.user.toJSON());
});

module.exports = {
    initPassport,
    routes
};
