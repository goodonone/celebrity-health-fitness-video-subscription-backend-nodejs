"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskFactory = exports.Task = void 0;
const sequelize_1 = require("sequelize");
class Task extends sequelize_1.Model {
}
exports.Task = Task;
function TaskFactory(sequelize) {
    Task.init({
        taskId: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        Title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Completed: {
            type: sequelize_1.DataTypes.BOOLEAN,
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
        tableName: 'tasks',
        sequelize
    });
}
exports.TaskFactory = TaskFactory;
