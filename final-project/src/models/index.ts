import { Sequelize } from "sequelize";
import { ProfileFactory, AssociateUserMessage } from "./payment";
import { UserFactory } from "./user";

const dbName = 'FitnessAPI';
const username = 'root';
const password = 'Password1!';

const sequelize = new Sequelize(dbName, username, password, {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
});

ProfileFactory(sequelize);
UserFactory(sequelize);
AssociateUserMessage();

export const db = sequelize;