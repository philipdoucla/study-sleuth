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
    const group = await req.user.getGroup();
    if (!group) {
        return res.json({
            status: 'none'
        });
    }
    const groupmates = await group.getUsers();
    const groupmateObjs = await Promise.all(
        groupmates.map(g => g.toJSON())
    );
    const complete = await group.complete();
    return res.json({
        status: complete ? 'complete' : 'incomplete',
        groupmates: groupmateObjs
    });
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
        } else if (fcUser.group) {
            return res.status(422).json({
                error: `Friend ${fc} is already in a group`
            });
        } else {
            friendUsers.push(fcUser);
        }
    }

    req.user.preferredGroupSize = preferredGroupSize;
    await req.user.save();
    let status = 'unknown';

    // if there are friends, form a partially complete group. otherwise, make them a "free agent"
    if (friendCodes.length) {
        const group = await Group.create({
            targetSize: preferredGroupSize,
            creator: req.user.id
        });
        req.user.group = group.id;
        for (const friend of friendUsers) {
            friend.group = group.id;
            friend.groupState = GroupStates.FoundGroup;
            await friend.save();
        }
        req.user.groupState = GroupStates.FoundGroup;
        await req.user.save();
        // pull in free agents right away, if possible
        const freeAgents = await req.user.findCompatibleUsers();
        for (const newUser of freeAgents) {
            newUser.group = group.id;
            newUser.groupState = GroupStates.FoundGroup;
            await newUser.save();
        }
        if (await group.complete()) {
            status = 'created_complete_group';
        } else {
            status = 'created_incomplete_group';
        }
    } else {
        req.user.groupState = GroupStates.InSearchPool;
        req.user.startedSearchAt = new Date();
        // free-agent matchmaking algorithm:
        // first, look for suitable matches with this user's profile + group size setting, and hope there's the right
        // number of people.
        const compatibleUsers = await req.user.findCompatibleUsers();
        if (compatibleUsers.length + 1 >= preferredGroupSize) {
            // in the ideal case where we found enough other free agents, create a brand new group
            const group = await Group.create({
                targetSize: preferredGroupSize,
                creator: req.user.id
            });
            req.user.group = group.id;
            for (const newUser of compatibleUsers) {
                newUser.group = group.id;
                newUser.groupState = GroupStates.FoundGroup;
                await newUser.save();
            }
            req.user.groupState = GroupStates.FoundGroup;
            await req.user.save();
            status = 'created_complete_group';
        } else {
            // if not found, just throw this user in the best partial group.
            const compatibleGroup = await req.user.findCompatibleGroup();
            if (compatibleGroup) {
                req.user.group = compatibleGroup.id;
                req.user.groupState = GroupStates.FoundGroup;
                await req.user.save();
                if (await compatibleGroup.complete()) {
                    status = 'joined_complete_group';
                } else {
                    status = 'joined_incomplete_group';
                }
            } else {
                // if there's no partial groups, leave them in the pool.
                status = 'in_pool';
            }
        }
    }

    await req.user.save();

    return res.json({
        status,
        groupState: req.user.groupState,
        group: req.user.group,
        preferredGroupSize: req.user.preferredGroupSize
    });
});

routes.post('/leaveGroup', authenticated, async (req, res) => {
    if (!req.user.group) {
        return res.status(400).json({
            error: 'You are not in a group.'
        });
    }
    // disband the group if person is the creator
    const grp = await req.user.getGroup();
    if (grp.creator === req.user.id) {
        for (const member of await grp.getUsers()) {
            member.group = null;
            member.groupState = GroupStates.NotSearching;
            await member.save();
        }
        await grp.destroy();
        req.user.groupState = GroupStates.NotSearching;
        await req.user.save();
        return res.json({
            status: 'disbanded'
        });
    }
    req.user.groupState = GroupStates.NotSearching;
    req.user.group = null;
    await req.user.save();
    return res.json({
        status: 'left'
    });
});

module.exports = {
    routes
};
