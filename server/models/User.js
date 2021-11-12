const connectDb = require('../db.js');
const crypto = require('crypto');
const Group = require('./Group.js');
const { DataTypes, Model } = require('sequelize');

class User extends Model {
    /**
     * Generates a user ID ("friend code") of the format XXX-XXX-XXX.
     * @returns {string}
     */
    static randomId() {
        // 5 bytes gives us 10 hex digits, we only need 9
        const digits = crypto.randomBytes(5).toString('hex').slice(0, -1);
        return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6, 9);
    }
}

(async () => {
    User.init({
        id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'fname'
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'lname'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        major: {
            type: DataTypes.INTEGER
        },
        residence: {
            type: DataTypes.INTEGER
        },
        groupState: {
            type: DataTypes.INTEGER,
            field: 'group_state'
        },
        preferredGroupSize: {
            type: DataTypes.INTEGER,
            field: 'preferred_group_size'
        },
        group: {
            type: DataTypes.INTEGER,
            references: {
                model: Group,
                key: 'id'
            }
        }
    }, {
        sequelize: await connectDb(),
        modelName: 'User',
        timestamps: false,
        tableName: 'users'
    });
})();

module.exports = User;
