/**
 * group.js
 */
const { authenticated } = require('./middleware');
const express = require("express");
const { User } = require('./db');

const routes = express.Router();
routes.get('/group', authenticated, async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });
    const group = await user.getGroup();
    if (!group) {
        return res.json({});
    }
    const groupmates = await group.getUsers();
    return res.json(groupmates);
});

module.exports = {
    routes
};
