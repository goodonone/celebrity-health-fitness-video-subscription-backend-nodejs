import { Sequelize } from "sequelize";
import { UserFactory } from "./user";
import { ProductFactory } from "./product";
import { CartFactory, AssociateCartUser } from "./cart";
import { CartProductFactory, AssociateCartProduct } from "./cart-product";
import { PaymentFactory, AssociateUserPayment } from "./payment";
import { productList } from './productList';
import { Product } from "./product"; 


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

// Function to seed the database
async function seedDatabase() {
    await sequelize.sync({ force: true }); // Be cautious with `force: true`
    await Product.bulkCreate(productList);
}

// Call the seed function
seedDatabase().then(() => console.log("Database seeded!")).catch(error => console.error("Error seeding database:", error));


export const db = sequelize;