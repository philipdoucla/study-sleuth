/**
 * group.js
 */
const { Group, User } = require('./db');
const { authenticated } = require('./middleware');
const { GroupStates } = require('../shared/constants');
const { isValidGroupSize, isValidFriendCodeList } = require('../shared/validation');
const express = require("express");

const routes = express.Router();
routes.get('/group', authenticated, async (req, res) => {
    const group = await req.dbUser.getGroup();
    if (!group) {
        return res.json({});
    }
    const groupmates = await group.getUsers();
    return res.json(groupmates);
});

routes.post('/startSleuthing', authenticated, async (req, res) => {
    let { preferredGroupSize, friendCodes } = req.body;

    if (!preferredGroupSize) {
        preferredGroupSize = 5;
    } else {
        preferredGroupSize = +preferredGroupSize;
        if (!isValidGroupSize(preferredGroupSize)) {
            return res.status(422).json({
                error: 'Invalid preferred group size'
            });
        }
    }
    if (!friendCodes) {
        friendCodes = [];
    } else if (!isValidFriendCodeList(friendCodes)) {
        return res.status(422).json({
            error: 'One or more friend codes is improperly formatted'
        });
    }

    // friends + you + at least one random person are needed to form a group
    const minGroupSize = friendCodes.length + 2;
    if (preferredGroupSize < minGroupSize) {
        return res.status(422).json({
            error: `Preferred group size is too low, must be at least ${minGroupSize}`
        });
    }

    // friends must actually exist, not have a group
    const friendUsers = [];
    for (const fc of friendCodes) {
        const fcUser = await User.findOne({
            where: {
                id: fc
            }
        });
        if (!fcUser) {
            return res.status(422).json({
                error: `No user with the friend code ${fc} exists`
            });
        } else if ('id' in (await fcUser.getGroup())) {
            return res.status(422).json({
                error: `Friend ${fc} is already in a group`
            });
        } else {
            friendUsers.push(fcUser);
        }
    }

    req.dbUser.preferredGroupSize = preferredGroupSize;

    // if there are friends, form a partially complete group. otherwise, make them a "free agent"
    if (friendCodes.length) {
        const group = await Group.create({
            targetSize: preferredGroupSize
        });
        req.dbUser.group = group.id;
        for (const friend of friendUsers) {
            friend.group = group.id;
            friend.groupState = GroupStates.FoundGroup;
            await friend.save();
        }
        // TODO: pull in free agents right away
        req.dbUser.groupState = GroupStates.FoundGroup;
    } else {
        req.dbUser.groupState = GroupStates.InSearchPool;
        req.dbUser.startedSearchAt = new Date();
        // TODO: implement free-agent matchmaking algorithm!!!
        // first, look for suitable matches with this user's profile + group size setting, and hope there's the right
        // number of people.
        // if not found, just throw them in the oldest partial group.
        // if there's no partial groups, leave them in the pool.
    }

    await req.dbUser.save();

    return res.json({
        groupState: req.dbUser.groupState,
        group: req.dbUser.group,
        preferredGroupSize: req.dbUser.preferredGroupSize
    });
});

module.exports = {
    routes
};
