/**
 * user.js
 */
const bcrypt = require('bcrypt');
const { User, Rating } = require('./db');
const { authenticated } = require('./middleware');
const { Majors, ResidenceHalls } = require('../shared/constants');
const { isValidClass, isValidName, isValidPassword, isValidRating } = require('../shared/validation');
const express = require("express");

const routes = express.Router();

routes.get('/me', authenticated, async (req, res) => {
    const userObj = req.user.toJSON();
    userObj.overallRating = await req.user.overallRating();
    return res.status(200).json(userObj);
});

routes.post('/password', authenticated, async (req, res) => {
    const { password, newPassword, newPasswordConfirm } = req.body;

    if (!password || !newPassword || !newPasswordConfirm) {
        return res.status(422).json({
            error: 'Must supply current password, new password, and new password confirmation'
        });
    }

    const correctPassword = await bcrypt.compare(password, req.user.password());
    if (!correctPassword) {
        return res.status(403).json({
            error: 'The old password is incorrect.'
        });
    }

    if (!isValidPassword(newPassword)) {
        return res.status(422).json({
            error: 'The new password is invalid.'
        });
    }

    if (newPasswordConfirm !== newPassword) {
        return res.status(422).json({
            error: 'The new password and new password confirmation do not match.'
        });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    return res.status(200).json({});
});

routes.post('/profile', authenticated, async (req, res) => {
    let { academicClass, major, residence, firstName, lastName } = req.body;

    if (!academicClass || !major || !residence || !firstName || !lastName) {
        return res.status(422).json({
            error: 'Academic class, major, residence, first and last name fields are required.'
        });
    }

    if (!isValidClass(academicClass)) {
        return res.status(422).json({
            error: `Invalid academic class ${academicClass}`
        });
    }

    if (!(major in Majors)) {
        return res.status(422).json({
            error: `Unknown major ${major}`
        });
    }
    major = Majors[major];

    if (!(residence in ResidenceHalls)) {
        return res.status(422).json({
            error: `Unknown residence hall ${residence}`
        });
    }
    residence = ResidenceHalls[residence];

    if (!isValidName(firstName) || !isValidName(lastName)) {
        return res.status(422).json({
            error: 'Invalid first or last name'
        });
    }

    req.user.set({
        academicClass, major, residence, firstName, lastName
    });

    await req.user.save();
    return res.status(200).json(req.user.toJSON());
});

routes.post('/rateUser', authenticated, async function (req, res) {
    let { target, value } = req.body;
    if (!target) {
        return res.status(422).json({
            error: 'No target user was specified'
        });
    }
    const targetUser = await User.findOne({
        where: {
            id: target
        }
    });
    if (!targetUser) {
        return res.status(422).json({
            error: `User ${target} does not exist`
        });
    }
    if (!targetUser.group || targetUser.group !== req.user.group) {
        return res.status(403).json({
            error: `You cannot leave a rating for user ${target} as they are not your groupmate.`
        });
    }
    if (!value) {
        return res.status(422).json({
            error: 'Must provide a value for this rating'
        });
    }
    value = +value;
    if (!isValidRating(value)) {
        return res.status(422).json({
            error: 'Rating must be an integer from 1-5'
        });
    }

    // you can overwrite a previous rating, but it should use the same row
    const existingRating = await Rating.findOne({
        where: {
            rater: req.user.id,
            target
        }
    });
    if (existingRating) {
        existingRating.value = value;
        await existingRating.save();
    } else {
        await Rating.create({
            rater: req.user.id,
            target,
            value
        });
    }
    return res.json({
        isNewRating: !existingRating,
        overallRating: await targetUser.overallRating()
    });
});

module.exports = {
    routes
};
