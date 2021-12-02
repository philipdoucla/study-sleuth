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
 * @returns {boolean}
 */
const isValidGroupSize = function (sz) {
    return Number.isInteger(sz) && sz >= 2 && sz < 10;
};

/**
 * Verifies that a friend code list is valid.
 * @param {String[]} fcs
 * @returns {boolean}
 */
const isValidFriendCodeList = function (fcs) {
    for (const fc of fcs) {
        if (!/[0-9A-F]{3}-[0-9A-F]{3}-[0-9A-F]{3}/i.test(fc)) {
            return false;
        }
    }
    return true;
};

/**
 * Verifies that a rating (out of 5 stars) is in the valid range.
 * @param {Number} value
 * @returns {boolean}
 */
const isValidRating = function (value) {
    return Number.isInteger(value) && value >= 1 && value <= 5;
};

/**
 * Verifies that a name is valid. Just a simple length check.
 * @param {String} name
 * @returns {boolean}
 */
const isValidName = function (name) {
    return name.length > 0;
};

/**
 * Verifies that an academic class name is valid. Doesn't actually
 * check the course catalog, just a simple length check.
 * @param {String} className
 * @returns {boolean}
 */
const isValidClass = function (className) {
    return className.length > 0;
};

module.exports = {
    isValidClass,
    isValidEmail,
    isValidFriendCodeList,
    isValidGroupSize,
    isValidName,
    isValidPassword,
    isValidRating
};
