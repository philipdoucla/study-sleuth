const connectDb = require('../db.js');
const { DataTypes, Model } = require('sequelize');

class Group extends Model {}

(async () => {
    Group.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true
        }
    }, {
        sequelize: await connectDb(),
        modelName: 'Group',
        timestamps: false,
        tableName: 'groups'
    });
})();

module.exports = Group;
