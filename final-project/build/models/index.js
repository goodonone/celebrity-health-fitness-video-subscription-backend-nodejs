"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
const profile_1 = require("./profile");
const user_1 = require("./user");
const dbName = 'FitnessAPI';
const username = 'root';
const password = 'Password1!';
const sequelize = new sequelize_1.Sequelize(dbName, username, password, {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
});
(0, profile_1.ProfileFactory)(sequelize);
(0, user_1.UserFactory)(sequelize);
(0, profile_1.AssociateUserMessage)();
exports.db = sequelize;
