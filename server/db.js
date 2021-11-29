const crypto = require('crypto');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
const path = require('path');
const { DataTypes, Model } = require("sequelize");
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    }
});


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

class Group extends Model {

}

Group.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true
    }
}, {
    sequelize: db,
    modelName: 'Group',
    timestamps: false,
    tableName: 'groups'
});

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
    sequelize: db,
    modelName: 'User',
    timestamps: false,
    tableName: 'users'
});

Group.hasMany(User, { foreignKey: 'group' });
User.belongsTo(Group, { foreignKey: 'group' });

(async () => {
    await db.authenticate();
    console.log('Connected to db');
})();

module.exports = { Group, User };
