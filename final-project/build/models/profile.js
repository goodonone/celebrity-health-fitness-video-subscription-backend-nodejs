"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociateUserMessage = exports.ProfileFactory = exports.Profile = void 0;
const sequelize_1 = require("sequelize");
const user_1 = require("./user");
class Profile extends sequelize_1.Model {
}
exports.Profile = Profile;
function ProfileFactory(sequelize) {
    Profile.init({
        profileId: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        DateOfBirth: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        Gender: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        Weight: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        Height: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        BodyMassIndex: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        DietaryPreference: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        Goals: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        Tier: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        }
    }, {
        freezeTableName: true,
        tableName: 'profiles',
        sequelize
    });
}
exports.ProfileFactory = ProfileFactory;
function AssociateUserMessage() {
    user_1.User.hasMany(Profile, { foreignKey: 'userId' });
    Profile.belongsTo(user_1.User, { foreignKey: 'userId' });
}
exports.AssociateUserMessage = AssociateUserMessage;
