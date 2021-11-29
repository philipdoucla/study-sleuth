/**
 * constants.js
 * Enums used in both client and server code.
 */

module.exports = {
    Majors: Object.freeze({
        "Computer Science": 0,
        "Computer Engineering": 1,
        "Computer Science and Engineering": 2
    }),
    ResidenceHalls: Object.freeze({
        "De Neve": 0,
        "Hedrick": 1,
        "Rieber": 2,
        "Sproul/Sunset Village": 3
    }),
    GroupStates: Object.freeze({
        NotSearching: 0,
        InSearchPool: 1,
        FoundGroup: 2
    })
};
