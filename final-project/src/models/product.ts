import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
//import { Payment } from "./payment";
// import {Cart} from "./cart";

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>>{
    declare productId: number;
    //declare paymentId: number;
    declare productName: string;
    declare productPrice: number;
    declare productDescription: string;
    declare productUrl: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

export function ProductFactory(sequelize: Sequelize) {
    Product.init({
        productId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        // paymentId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        productName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productPrice: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
       
        productUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'products',
        freezeTableName: true,
        sequelize
    });
}
// export function AssociateCartProduct() {
//     Cart.hasMany(Product, { foreignKey: 'productId' });
//     Product.belongsTo(Cart, { foreignKey: 'productId' });
// }
// export function AssociateCartProduct() {
//     Product.hasMany(Cart, { foreignKey: 'productId' });
//     Cart.belongsTo(Product, { foreignKey: 'productId' });
// }