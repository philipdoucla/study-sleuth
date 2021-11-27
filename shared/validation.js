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
    return password.length >= 6;
};

module.exports = {
    isValidEmail,
    isValidPassword
};
