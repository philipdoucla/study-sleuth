/**
 * user.js
 */
const { User, Rating } = require('./db');
const { authenticated } = require('./middleware');
const { isValidRating } = require('../shared/validation');
const express = require("express");

const routes = express.Router();

routes.get('/me', authenticated, async (req, res) => {
    const userObj = req.user.toJSON();
    userObj.overallRating = await req.user.overallRating();
    return res.status(200).json(userObj);
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
