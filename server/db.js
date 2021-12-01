const crypto = require('crypto');
const dotenv = require('dotenv');
const { GroupStates } = require('../shared/constants');
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


class Rating extends Model {
}

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

    /**
     * Gives the mean rating, out of 5 stars, for this user.
     * May return 0 if there are no ratings.
     * @returns {Promise<number>}
     */
    async overallRating() {
        const allRatings = await this.getRatings();
        // avoid division by zero
        if (allRatings.length === 0) {
            return 0;
        }
        let total = 0;
        for (const rating of allRatings) {
            total += rating.value;
        }
        return total / allRatings.length;
    }

    async toJSON() {
        const userObj = super.toJSON();
        userObj.overallRating = await this.overallRating();
        return userObj;
    }

    /**
     * Queries for compatible users to form a new group, or complete an existing group, when the user is already in one.
     * Attempts to honor all parties' group size preferences, but is more flexible when completing a group.
     * May return fewer users than the ideal case.
     * @returns {Promise<User[]>}
     */
    async findCompatibleUsers() {
        let remainingGroupSize = this.preferredGroupSize - 1;
        if (this.group) {
            const group = await this.getGroup();
            remainingGroupSize = group.targetSize - (await group.countUsers());
        }
        let query = "SELECT *, ABS(residence - $1) AS distance, ABS(preferred_group_size - $2) AS dsize, " +
            "ABS(major - $3) AS dmajor FROM users " +
            "WHERE id != $4 AND academic_class = $5 AND group_state = $6 ";
        // when completing a partial group, we don't need to strictly respect everyone's group size preference
        if (!this.group) {
            query += "AND preferred_group_size = $2 ";
        }
        query += "ORDER BY distance ASC, dsize ASC, dmajor ASC, started_search_at ASC LIMIT $7";
        const matchingUsers = await db.query(query, {
            bind: [
                this.residence,
                this.preferredGroupSize,
                this.major,
                this.id,
                this.academicClass,
                GroupStates.InSearchPool,
                remainingGroupSize
            ],
            type: Sequelize.QueryTypes.SELECT,
            model: User,
            mapToModel: true
        });
        return matchingUsers.slice(0, remainingGroupSize);
    }

    /**
     * Queries for compatible incomplete groups to add a free agent to.
     * It is recommended to try findCompatibleUsers() before this method, since it produces better matches with respect
     * to peoples' preferences.
     */
    async findCompatibleGroup() {
        const results = await db.query(
            "SELECT groups.*, target_size - COUNT(users.*) AS members_needed FROM groups " +
            "INNER JOIN users ON users.group = groups.id " +
            "WHERE (SELECT academic_class FROM users WHERE users.id = groups.creator) = $1 " +
            "GROUP BY groups.id ORDER BY members_needed DESC LIMIT 1", {
            bind: [this.academicClass],
            type: Sequelize.QueryTypes.SELECT,
            model: Group,
            mapToModel: true
        });
        if (!results.length) {
            return null;
        } else {
            return results[0];
        }
    }
}

class Group extends Model {
    /**
     * Returns whether this group is complete.
     * Incomplete groups may occur if we have friends in our group, but are awaiting free agents.
     * Such groups are hidden from the end-user.
     * @returns {Promise<boolean>}
     */
    async complete() {
        return (await this.countUsers()) === this.targetSize;
    }
}

Group.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    targetSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'target_size'
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
        allowNull: false,
        // require explicit password() call to view the password
        // otherwise, skipped by serialization
        get() {
            return () => this.getDataValue('password');
        }
        // note: I don't think it's possible to automatically hash the password
        // inside the setter, because hashing returns a promise, and we can't do that here
    },
    major: {
        type: DataTypes.INTEGER
    },
    residence: {
        type: DataTypes.INTEGER
    },
    academicClass: {
        type: DataTypes.STRING,
        field: 'academic_class'
    },
    groupState: {
        type: DataTypes.INTEGER,
        field: 'group_state'
    },
    preferredGroupSize: {
        type: DataTypes.INTEGER,
        field: 'preferred_group_size'
    },
    startedSearchAt: {
        type: DataTypes.DATE,
        field: 'started_search_at'
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

Rating.init({
    target: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'id'
        }
    },
    rater: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'id'
        }
    },
    value: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: db,
    modelName: 'Rating',
    timestamps: false,
    tableName: 'ratings'
});

Group.hasMany(User, { foreignKey: 'group' });
User.belongsTo(Group, { foreignKey: 'group' });
// owner
Group.belongsTo(User, { foreignKey: 'creator' });
// only really care about ratings directed toward a user, not the ratings one user has given out
User.hasMany(Rating, { foreignKey: 'target' });

(async () => {
    await db.authenticate();
    console.log('Connected to db');
})();

module.exports = { Group, Rating, User };
