// import { Model, DataTypes, Sequelize } from "sequelize";
// import { Product } from './product';
// import { Cart } from './cart';

// export class CartProduct extends Model {
//     declare cartId: number;
//     declare productId: number;
//     declare itemQuantity: number;
// }

// export function CartProductFactory(sequelize: Sequelize) {
//     CartProduct.init({
//         // Define your fields here with types and references
//         cartId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: 'cart',
//                 key: 'cartId',
//             }
//         },
//         productId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: 'product',
//                 key: 'productId',
//             }
//         },
//         itemQuantity: {
//                 type: DataTypes.INTEGER,
//                 defaultValue: 1,
//                 validate: { min: 1 }
//         }
//     }, 
//         {
//         tableName: 'cart_products',
//         freezeTableName: true,
//         sequelize
//     })
// };

// export function AssociateCartProduct() {
//     Cart.belongsToMany(Product, {through: CartProduct, foreignKey: 'cartId'});
//     Product.belongsToMany(Cart, {through: CartProduct, foreignKey: 'productId'});
// }


import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes } from "sequelize";
// import { Product } from './product';
import { Cart } from './cart';
import { Product } from "./product";
// import { User } from "./user";
import { Snowflake } from "nodejs-snowflake";

// Initialize Snowflake ID generator
const uid = new Snowflake({
    custom_epoch: 1725148800000, 
    instance_id: 1
  });

export class CartProduct extends Model<InferAttributes<CartProduct>, InferCreationAttributes<CartProduct>> {
    declare cartProductId: string;
    declare cartId: string;
    declare productId: string;
    declare quantity: number;
    declare createdAt: Date;
    declare updatedAt: Date;
}

export function CartProductFactory(sequelize: Sequelize): typeof CartProduct {
    CartProduct.init({
        cartProductId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        cartId: {
            type: DataTypes.STRING,
            allowNull: false,
            // references: {
            //     model: 'carts',
            //     key: 'cartId'
            // }
        },
        productId: {
            type: DataTypes.STRING,
            allowNull: false,
            // references: {
            //     model: 'products',
            //     key: 'productId'
            // }
        },
        quantity: {
            type: DataTypes.INTEGER,
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
        tableName: 'cart_products',
        freezeTableName: true,
        sequelize,
        timestamps: false
        // indexes: [
        //     {
        //         unique: true,
        //         fields: ['cartId', 'productId'],
        //         name: 'cart_product_unique'
        //     }
        // ],
        // hooks: {
        //     beforeSync: (options: any) => {
        //         options.hooks = false;
        //     }
        // }
    });

    return CartProduct;
}

// export function AssociateCartProduct() {
//     User.hasOne(Cart, { foreignKey: 'userId' });
//     Cart.belongsTo(User, { foreignKey: 'userId' });

//     Cart.belongsToMany(Product, { through: CartProduct, foreignKey: 'cartId' });
//     Product.belongsToMany(Cart, { through: CartProduct, foreignKey: 'productId' });
//     CartProduct.belongsTo(Cart, { foreignKey: 'cartId' });
//     CartProduct.belongsTo(Product, { foreignKey: 'productId' });
// }