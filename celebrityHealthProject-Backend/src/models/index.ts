// import { Sequelize } from "sequelize";
// import { UserFactory } from "./user";
// import { ProductFactory } from "./product";
// import { CartFactory, AssociateCartUser } from "./cart";
// import { CartProductFactory, AssociateCartProduct } from "./cart-product";
// import { PaymentFactory, AssociateUserPayment } from "./payment";
// import { productList } from './productList';
// import { Product } from "./product"; 


// const dbName = 'FitnessAPI';
// const username = 'root';
// const password = 'Password1!';

// const sequelize = new Sequelize(dbName, username, password, {
//     host: '127.0.0.1',
//     port: 3306,
//     dialect: 'mysql'
// });

// UserFactory(sequelize);
// ProductFactory(sequelize);
// CartFactory(sequelize);
// PaymentFactory(sequelize);
// CartProductFactory(sequelize);

// AssociateCartProduct();
// AssociateCartUser();
// AssociateUserPayment();

// // Function to sync database and seed
// async function initializeDatabase() {
//     try {
//         // Sync all models
//         // await sequelize.sync({ force: true });
//         await sequelize.sync();
//         console.log("Database synchronized");

//         // Seed the database
//         // await Product.bulkCreate(productList);
//         // console.log("Database seeded!");
        
//         // Optionally seed the database
//         // Check if the products table is empty before seeding
//         const productCount = await Product.count();
//         console.log("---------------------------",productCount)
//         // if (productCount === 0) {
//         if (productCount <= 10) {
//             await Product.bulkCreate(productList);
//             console.log("Database seeded!");
//         } else {
//             console.log("Database already has data, skipping seeding.");
//         }
//     } catch (error) {
//         console.error("Error initializing database:", error);
//     }
// }

// // Initialize the database
// initializeDatabase();

// // Function to seed the database
// // async function seedDatabase() {
// //     await sequelize.sync({ force: true }); // Be cautious with `force: true`
// //     await Product.bulkCreate(productList);
// // }

// // // Call the seed function
// // seedDatabase().then(() => console.log("Database seeded!")).catch(error => console.error("Error seeding database:", error));


// export const db = sequelize;

// import { Sequelize } from "sequelize";
// import { UserFactory } from "./user";
// import { ProductFactory } from "./product";
// import { CartFactory } from "./cart";
// import { CartProductFactory } from "./cart-product";
// import { Product as ProductModel } from "./product";
// import { PaymentFactory } from "./payment";
// import { productList, ProductListItem } from './productList';
// import { AssociateAllModels } from './associations';
// import { Snowflake } from "nodejs-snowflake";
// import { exec } from 'child_process';
// import util from 'util';

// const execPromise = util.promisify(exec);

// const dbName = 'FitnessAPI';
// const username = 'root';
// const password = 'Password1!';

// const sequelize = new Sequelize(dbName, username, password, {
//     host: '127.0.0.1',
//     port: 3306,
//     dialect: 'mysql',
//     logging: console.log
// });

// // Initialize Snowflake ID generator
// const uid = new Snowflake({
//     custom_epoch: 1725148800000, 
//     instance_id: 1
// });

// // Initialize models
// const User = UserFactory(sequelize);
// const Product = ProductFactory(sequelize);
// const Cart = CartFactory(sequelize);
// const CartProduct = CartProductFactory(sequelize);
// const Payment = PaymentFactory(sequelize);

// // Set up all associations
// // AssociateAllModels();

// // Function to sync database and seed
// function ensureDate(value: string | Date | undefined): Date {
//     if (value instanceof Date) return value;
//     if (typeof value === 'string') return new Date(value);
//     return new Date();
// }


// async function initializeDatabase() {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');

//         // Disable foreign key checks
//         await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

//         // Drop all tables
//         await sequelize.drop({ cascade: true });
//         console.log("All tables dropped successfully.");

//         // Create tables
//         await User.sync({ force: true });
//         await Product.sync({ force: true });
//         await Cart.sync({ force: true });
//         await CartProduct.sync({ force: true });
//         await Payment.sync({ force: true });

//         console.log("All tables created successfully.");

//         // Re-enable foreign key checks
//         await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

//         // Set up associations
//         AssociateAllModels();

//         // Verify tables
//         const tables = await sequelize.getQueryInterface().showAllTables();
//         console.log("Tables in database:", tables);

//         await seedDatabase();
//         console.log("Database seeded successfully.");

//         console.log("Database initialization completed successfully");
//     } catch (error) {
//         console.error("Error during database initialization:", error);
//         process.exit(1);
//     }
// }

// async function runCommand(command: string) {
//     try {
//         const { stdout, stderr } = await execPromise(command);
//         console.log('stdout:', stdout);
//         if (stderr) console.error('stderr:', stderr);
//     } catch (error) {
//         console.error(`Error executing command: ${command}`);
//         throw error;
//     }
// }

// async function initializeDatabase() {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');

//         // Run migrations
//         console.log('Running migrations...');
//         await runCommand('npx sequelize-cli db:migrate');
//         console.log('Migrations completed successfully.');

//         // Run seeders
//         console.log('Running seeders...');
//         await runCommand('npx sequelize-cli db:seed:all');
//         console.log('Seeding completed successfully.');

//         console.log("Database initialization completed successfully");
//     } catch (error) {
//         console.error("Error during database initialization:", error);
//         if (error instanceof Error) {
//             console.error(error.stack);
//         }
//         process.exit(1);
//     }
// }

//  // Sync all models
//  await sequelize.sync({ force: true });
//  console.log("All tables recreated");

//  // Verify that tables exist
//  const tables = await sequelize.getQueryInterface().showAllTables();
//  console.log("Tables created:", tables);

//  await seedDatabase();
//  console.log("Database initialization completed successfully");

// Separate function for seeding, if needed
// async function seedDatabase() {
//     const productCount = await Product.count();
//         console.log("Current product count:", productCount);

//         if (productCount === 0) {
//             // const now = new Date();
//             const productsToCreate = productList.map((product: ProductListItem) => ({
//                 productId: uid.getUniqueID().toString(),
//                 productName: product.productName,
//                 productPrice: product.productPrice,
//                 productDescription: product.productDescription,
//                 productUrl: product.productUrl,
//                 createdAt: ensureDate(product.createdAt),
//                 updatedAt: ensureDate(product.updatedAt)
//             }));
            
//             await Product.bulkCreate(productsToCreate);
//             console.log("Database seeded!");
//         } else {
//             console.log("Database already has sufficient data, skipping seeding.");
//         }
// }

// // Initialize the database
// initializeDatabase().then(() => {
//     console.log("Database setup completed. Starting server...");
//     // Start your server or perform other app initialization here
// }).catch(error => {
//     console.error("Failed to initialize database:", error);
//     process.exit(1);
// });

// export const db = sequelize;

// import { Sequelize } from 'sequelize';

// const config = require('../config/config.json');


// const env = process.env.NODE_ENV || 'development';
// const dbConfig = config[env];

// const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
//     host: dbConfig.host,
//     dialect: dbConfig.dialect as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql',
//     logging: false,
// });

// export const db = sequelize;

import { Sequelize } from 'sequelize';
import config from '../config/config.json';

type ConfigEnv = 'development' | 'test' | 'production';

interface DbConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
}

const env = (process.env.NODE_ENV || 'development') as ConfigEnv;
const dbConfig = config[env] as DbConfig;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password ?? undefined, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false,
});

export const db = sequelize;