import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
//import { Payment } from "./payment";
import { User } from "./user";
import { Product } from "./product";

export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>>{
    declare cartId: number;
    declare userId: string;
    declare productId: number;
    declare itemQuantity: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

export function CartFactory(sequelize: Sequelize) {
    Cart.init({
        cartId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
        itemQuantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            validate: { min: 1 }
        }
    }, {
        tableName: 'cart',
        freezeTableName: true,
        sequelize
    });
}

// Cart.belongsTo(User, { foreignKey: 'userId' });

export function AssociateCartUser() {
    //Cart.hasOne(User, { foreignKey: 'userId' });
    //User.belongsTo(Cart, { foreignKey: 'userId' });
    User.hasOne(Cart,{ foreignKey: 'userId'})
    Cart.belongsTo(User, { foreignKey: 'userId' })
   // Cart.belongsTo(Product, { foreignKey: 'productId' });
}

export function AssociateCartProduct() {
    Cart.hasMany(Product, { foreignKey: 'productId' });
    Product.belongsTo(Cart, { foreignKey: 'productId' });
}

// export function AssociateCartUserProduct() {
//     //Cart.hasOne(User, { foreignKey: 'userId' });
//     //User.belongsTo(Cart, { foreignKey: 'userId' });
//     User.hasMany(Cart,{ foreignKey: 'userId'})
//     Cart.belongsTo(User, { foreignKey: 'userId' })
//    // Cart.belongsTo(Product, { foreignKey: 'productId' });
// }
