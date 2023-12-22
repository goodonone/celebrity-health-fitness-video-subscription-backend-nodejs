import { Sequelize } from "sequelize";
import { UserFactory, AssociateCartUser } from "./user";
import { ProductFactory, AssociateCartProduct } from "./product";
import { CartFactory } from "./cart";
import { PaymentFactory, AssociateUserPayment } from "./payment";

const dbName = 'FitnessAPI';
const username = 'root';
const password = 'Password1!';

const sequelize = new Sequelize(dbName, username, password, {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
});

UserFactory(sequelize);
ProductFactory(sequelize);
CartFactory(sequelize);
PaymentFactory(sequelize);
AssociateCartProduct();
AssociateCartUser();
AssociateUserPayment();

export const db = sequelize;