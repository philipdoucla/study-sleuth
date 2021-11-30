const { authenticated } = require('./middleware');
const express = require("express");
const { User } = require('./db');

const routes = express.Router();

routes.post('/profile', authenticated, async (req, res) => {
    let {academicClass, major, residence, firstName, lastName, password, cPassword} = req.body;
    console.log(academicClass);
    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });
    user.academicClass=academicClass;
    user.major=major;
    user.residence=residence;
    user.firstName=firstName;
    user.lastName=lastName;

    await user.save()
    .then( () => {
        console.log(user);
        return res.status(200).json("Updated User");
    })
    .catch(() => {
        return res.status(500).json({'error': 'Updating data failed'});
    })


});


module.exports = {
    routes
};