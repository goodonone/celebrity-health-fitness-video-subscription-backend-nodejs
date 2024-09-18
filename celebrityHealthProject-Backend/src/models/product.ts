// import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
// //import { Payment } from "./payment";
// // import {Cart} from "./cart";

// export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>>{
//     declare productId: number;
//     //declare paymentId: number;
//     declare productName: string;
//     declare productPrice: number;
//     declare productDescription: string;
//     declare productUrl: string;
//     declare createdAt?: Date;
//     declare updatedAt?: Date;
// }

// export function ProductFactory(sequelize: Sequelize) {
//     Product.init({
//         productId: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//             allowNull: false
//         },
//         // paymentId: {
//         //     type: DataTypes.INTEGER,
//         //     allowNull: false
//         // },
//         productName: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         productPrice: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },
//         productDescription: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
       
//         productUrl: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//     }, {
//         tableName: 'products',
//         freezeTableName: true,
//         sequelize
//     });
// }
// export function AssociateCartProduct() {
//     Cart.hasMany(Product, { foreignKey: 'productId' });
//     Product.belongsTo(Cart, { foreignKey: 'productId' });
// }
// export function AssociateCartProduct() {
//     Product.hasMany(Cart, { foreignKey: 'productId' });
//     Cart.belongsTo(Product, { foreignKey: 'productId' });
// }

import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
import { Snowflake } from "nodejs-snowflake";
import { Cart } from "./cart";
import { CartProduct } from "./cart-product";

// Initialize Snowflake ID generator
const uid = new Snowflake({
    custom_epoch: 1725148800000, 
    instance_id: 1
});

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare productId: string;
    declare productName: string;
    declare productPrice: number;
    declare productDescription: string;
    declare productUrl: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

export function ProductFactory(sequelize: Sequelize): typeof Product {
    Product.init({
        productId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uid.getUniqueID().toString() // Generate Snowflake ID
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productPrice: {
            type: DataTypes.DECIMAL(10, 2), // Changed to DECIMAL for more precise price representation
            allowNull: false
        },
        productDescription: {
            type: DataTypes.TEXT, // Changed to TEXT to allow for longer descriptions
            allowNull: false,
        },
        productUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        tableName: 'products',
        freezeTableName: true,
        sequelize
    });

    return Product;
}

// This function can be called after all models are initialized
// export function AssociateProductRelations() {
//     // Import these at the top of your file
//     Product.belongsToMany(Cart, { through: CartProduct, foreignKey: 'productId' });
//     CartProduct.belongsTo(Product, { foreignKey: 'productId' });
// }