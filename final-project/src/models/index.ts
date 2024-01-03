import { Sequelize } from "sequelize";
import { UserFactory } from "./user";
import { ProductFactory } from "./product";
import { CartFactory, AssociateCartUser } from "./cart";
import { CartProductFactory, AssociateCartProduct } from "./cart-product";
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
CartProductFactory(sequelize);

AssociateCartProduct();
AssociateCartUser();
AssociateUserPayment();

export const db = sequelize;