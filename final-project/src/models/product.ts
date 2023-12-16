import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
import { Payment } from "./payment";

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>>{
    declare productId: number;
    declare paymentId: number;
    declare Name: string;
    declare Description: string;
    declare imgUrl: string;
}

export function ProductFactory(sequelize: Sequelize) {
    Product.init({
        productId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        paymentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
       
        imgUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'products',
        freezeTableName: true,
        sequelize
    });
}
export function AssociateUserMessage() {
    Payment.hasMany(Product, { foreignKey: 'paymentId' });
    Product.belongsTo(Payment, { foreignKey: 'productId' });
}


//CREATE DATABASE FitnessAPI;
// USE FitnessAPI;

// CREATE TABLE products (
//   productId INTEGER AUTO_INCREMENT,
//   Name VARCHAR(255),
//   Description VARCHAR(255),
//   paymentId INT,  -- Assuming it's an integer, you can adjust the data type accordingly
//   imageUrl VARCHAR(255),  -- Assuming the URL can be stored in a VARCHAR column
//   PRIMARY KEY (productId),
//   FOREIGN KEY (paymentId) REFERENCES payments(paymentId)
// );



// SHOW TABLES;
// DESCRIBE FitnessAPI;git