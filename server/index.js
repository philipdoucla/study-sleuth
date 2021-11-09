const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const mysql = require('mysql')
const dotenv = require('dotenv');

const app = express();


dotenv.config({path : './.env.local'});

const db =   mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
}); 

db.connect( (error) => {
    if(error) throw error;
    console.log("Connection Secured")
});

app.get('/', (req, res) => {
    res.send('hello world');
});

app.post('/register', (req, res) => {
    const {username, email, password, passwordConfirm} = req.body;
    
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) throw error;

        if (res.length > 0) {
            return res.render('register', {
                message: 'Email in Use'
            });
        } else if (password != passwordConfirm) {
            return res.render('register', {
                messsage : "Passwords do not match"
            });
        }

        const hashedPassword = await bycrypt.hash(password, 10)
        
        db.query('INSERT INTO users SET ?', {name: username, email: email, password: hashedPassword}, () => {
            if (error) throw error; 
            res.render('register', {
                message : 'User successfully registered'
            });
        });
    });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
