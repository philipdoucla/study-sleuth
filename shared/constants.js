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
    /**
     * We use residence hall categories to approximate the
     * distance between students' dorms. The ordering is such that
     * subtraction does a good enough job.
     */
    ResidenceHalls: Object.freeze({
        "De Neve": 0,   // includes Dykstra
        "Sproul": 1,    // includes Sunset Village
        "Rieber": 2,    // includes Olympic/Centennial
        "Hedrick": 3    // includes off-campus apts
    }),
    GroupStates: Object.freeze({
        NotSearching: 0,
        InSearchPool: 1,
        FoundGroup: 2
    })
};
