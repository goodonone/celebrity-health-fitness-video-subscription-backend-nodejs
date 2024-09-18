// import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
// //import { Payment } from "./payment";
// import { User } from "./user";
// // import { Product } from "./product";

// export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>>{
//     declare cartId: number;
//     declare userId: number;
//     // declare productId: number;
//     // declare itemQuantity: number;
//     declare createdAt?: Date;
//     declare updatedAt?: Date;
// }

// export function CartFactory(sequelize: Sequelize) {
//     Cart.init({
//         cartId: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//             allowNull: false
//         },
//         userId: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },
//         // productId: {
//         //     type: DataTypes.INTEGER,
//         //     allowNull: false
//         //   },
//         // itemQuantity: {
//         //     type: DataTypes.INTEGER,
//         //     defaultValue: 1,
//         //     validate: { min: 1 }
//         // }
//     }, {
//         tableName: 'carts',
//         freezeTableName: true,
//         sequelize
//     });
// }

// // Cart.belongsTo(User, { foreignKey: 'userId' });

// export function AssociateCartUser() {
//     //Cart.hasOne(User, { foreignKey: 'userId' });
//     //User.belongsTo(Cart, { foreignKey: 'userId' });
//     User.hasOne(Cart,{ foreignKey: 'userId'})
//     Cart.belongsTo(User, { foreignKey: 'userId' })
//    // Cart.belongsTo(Product, { foreignKey: 'productId' });
// }

// // export function AssociateCartProduct() {
// //     Cart.belongsToMany(Product, { foreignKey: 'cartId' });
// //     Product.belongsToMany(Cart, { foreignKey: 'productId' });
// // }

// // export function AssociateCartUserProduct() {
// //     //Cart.hasOne(User, { foreignKey: 'userId' });
// //     //User.belongsTo(Cart, { foreignKey: 'userId' });
// //     User.hasMany(Cart,{ foreignKey: 'userId'})
// //     Cart.belongsTo(User, { foreignKey: 'userId' })
// //    // Cart.belongsTo(Product, { foreignKey: 'productId' });
// // }


// import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
// import { User } from "./user";
// import { Product } from "./product";
// import { Snowflake } from "nodejs-snowflake";

// // Initialize Snowflake ID generator
// const uid = new Snowflake({
//     custom_epoch: 1725148800000, 
//     instance_id: 1
//   });

// export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
//     declare cartId: string;
//     declare userId: string;
//     declare createdAt: Date;
//     declare updatedAt: Date;
// }

// export function CartFactory(sequelize: Sequelize) {
//     Cart.init({
//         cartId: {
//             type: DataTypes.STRING,
//             defaultValue: () => uid.getUniqueID().toString(),
//             primaryKey: true,
//             allowNull: false
//         },
//         userId: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             references: {
//                 model: 'users',
//                 key: 'userId'
//             }
//         },
//         createdAt: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: DataTypes.NOW,
//         },
//         updatedAt: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: DataTypes.NOW,
//         }
//     }, {
//         tableName: 'carts',
//         freezeTableName: true,
//         sequelize
//     });
// }

// export function AssociateCartUser() {
//     User.hasOne(Cart, { foreignKey: 'userId' });
//     Cart.belongsTo(User, { foreignKey: 'userId' });
// }

// export class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
//     declare cartItemId: string;
//     declare cartId: string;
//     declare productId: string;
//     declare quantity: number;
//     declare createdAt: Date;
//     declare updatedAt: Date;
// }

// export function CartItemFactory(sequelize: Sequelize) {
//     CartItem.init({
//         cartItemId: {
//             type: DataTypes.STRING,
//             defaultValue: DataTypes.UUIDV4,
//             primaryKey: true,
//             allowNull: false
//         },
//         cartId: {
//             type: DataTypes.UUID,
//             allowNull: false
//         },
//         productId: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         quantity: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             defaultValue: 1,
//             validate: { min: 1 }
//         },
//         createdAt: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: DataTypes.NOW,
//         },
//         updatedAt: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: DataTypes.NOW,
//         }
//     }, {
//         tableName: 'cart_items',
//         freezeTableName: true,
//         sequelize
//     });
// }

// export function AssociateCartItemRelations() {
//     Cart.hasMany(CartItem, { foreignKey: 'cartId' });
//     CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
//     // Assuming you have a Product model
//     Product.hasMany(CartItem, { foreignKey: 'productId' });
//     CartItem.belongsTo(Product, { foreignKey: 'productId' });
// }

import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";

import { Snowflake } from "nodejs-snowflake";

// Initialize Snowflake ID generator
const uid = new Snowflake({
    custom_epoch: 1725148800000, 
    instance_id: 1
});

export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
    declare cartId: string;
    declare userId: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

export function CartFactory(sequelize: Sequelize): typeof Cart {
    Cart.init({
        cartId: {
            type: DataTypes.STRING,
            defaultValue: () => uid.getUniqueID().toString(),
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
              model: 'users',
              key: 'userId'
            },
        },
        //     onUpdate: 'CASCADE',
        //     onDelete: 'CASCADE'
        //   },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'carts',
        freezeTableName: true,
        sequelize
        // hooks: {
        //     beforeSync: (options: any) => {
        //       options.hooks = false;
        //     }
        //   }
    });

    return Cart;
}

// export function AssociateCartRelations() {
//     User.hasOne(Cart, { foreignKey: 'userId' });
//     Cart.belongsTo(User, { foreignKey: 'userId' });

//     Cart.belongsToMany(Product, { through: 'CartProduct', foreignKey: 'cartId' });
//     Product.belongsToMany(Cart, { through: 'CartProduct', foreignKey: 'productId' });
// }