function authenticated(req, res, next) {
    if (!req.session || !req.user) {
        return res.status(401).json({
            error: 'You must be logged in.'
        });
    } else {
        return next();
    }
}

module.exports = { authenticated };
