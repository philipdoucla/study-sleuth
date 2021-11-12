const dotenv = require('dotenv');
const Sequelize = require('sequelize');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    }
});
// treat db as a singleton
// TODO: this doesn't actually work. lol.
let authenticated = false;

module.exports = async function () {
    try {
        if (!authenticated) {
            await db.authenticate();
            authenticated = true;
            console.log('Connected to db');
        }
        return db;
    } catch (err) {
        console.error('Unable to connect to db: ', err);
        throw err;
    }
};
