/**
 * validation.js
 * Shared validation logic between client and server.
 */

/**
 * Verifies that the email address is of the proper form and is part of UCLA.
 * @param {String} email
 * @returns {boolean}
 */
const isValidEmail = function (email) {
    return /^[^@\s]+@(\w+\.)?ucla\.edu$/i.test(email);
};

/**
 * Verifies that the password is of appropriate length (6 or more characters).
 * @param {String} password
 * @returns {boolean}
 */
const isValidPassword = function (password) {
    return typeof password === 'string' && password.length >= 6;
};

/**
 * Verifies that the desired group size is a valid number.
 * @param {Number} sz
 */
const isValidGroupSize = function (sz) {
    return Number.isInteger(sz) && sz >= 2 && sz < 10;
};

/**
 * Verifies that a friend code list is valid.
 * @param {String[]} fcs
 */
const isValidFriendCodeList = function (fcs) {
    for (const fc of fcs) {
        if (!/[0-9A-F]{3}-[0-9A-F]{3}-[0-9A-F]{3}/i.test(fc)) {
            return false;
        }
    }
    return true;
};

module.exports = {
    isValidEmail,
    isValidFriendCodeList,
    isValidGroupSize,
    isValidPassword
};
