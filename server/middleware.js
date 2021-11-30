/**
 * middleware.js
 */

const { User } = require('./db');

async function authenticated(req, res, next) {
    if (!req.session || !req.user) {
        return res.status(401).json({
            error: 'You must be logged in.'
        });
    } else {
        // automatically pass along user model from db, for relations and stuff
        // req.user is Passport's serialized version of the user, the whole model object doesn't belong there
        req.dbUser = await User.findOne({
            where: {
                id: req.user.id
            }
        });
        return next();
    }
}

module.exports = { authenticated };
