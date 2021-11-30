const AuthController = require('./auth.js');
const GroupController = require('./group.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.session());

// controller routes separated out into their own files
AuthController.initPassport();
app.use(AuthController.routes);
app.use(GroupController.routes);

app.get('/', (req, res) => {
    res.send('hello world');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
