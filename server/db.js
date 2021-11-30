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
}

class Group extends Model {

}

Group.init({
    id: {
        type: DataTypes.INTEGER,
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
// only really care about ratings directed toward a user, not the ratings one user has given out
User.hasMany(Rating, { foreignKey: 'target' });

(async () => {
    await db.authenticate();
    console.log('Connected to db');
})();

module.exports = { Group, Rating, User };
