

// export function AssociateAllModels() {

//     User.hasOne(Cart, { 
//         foreignKey: 'userId', 
//         // hooks: true,
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//         // constraints: false
//       });
//       Cart.belongsTo(User, { 
//         foreignKey: 'userId', 
//         // hooks: true,
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//         // constraints: false
//       });

//     // Cart-Product Association
//     Cart.belongsToMany(Product, { through: CartProduct, foreignKey: 'cartId' });
//     Product.belongsToMany(Cart, { through: CartProduct, foreignKey: 'productId' });
//     CartProduct.belongsTo(Cart, { foreignKey: 'cartId' });
//     CartProduct.belongsTo(Product, { foreignKey: 'productId' });

//     // User-Payment Association
//     User.hasMany(Payment, { foreignKey: 'userId' });
//     Payment.belongsTo(User, { foreignKey: 'userId' });


// }

// export function AssociateAllModels() {
//     User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
//     Cart.belongsTo(User, { foreignKey: 'userId' });

//     Cart.belongsToMany(Product, { through: CartProduct, foreignKey: 'cartId' });
//     Product.belongsToMany(Cart, { through: CartProduct, foreignKey: 'productId' });
    
//     CartProduct.belongsTo(Cart, { foreignKey: 'cartId' });
//     CartProduct.belongsTo(Product, { foreignKey: 'productId' });

//     User.hasMany(Payment, { foreignKey: 'userId' });
//     Payment.belongsTo(User, { foreignKey: 'userId' });
// }

// export function AssociateAllModels() {
//     User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
//     Cart.belongsTo(User, { foreignKey: 'userId' });

//     Cart.belongsToMany(Product, { through: CartProduct, foreignKey: 'cartId' });
//     Product.belongsToMany(Cart, { through: CartProduct, foreignKey: 'productId' });

//     CartProduct.belongsTo(Cart, { foreignKey: 'cartId' });
//     CartProduct.belongsTo(Product, { foreignKey: 'productId' });
//     Cart.hasMany(CartProduct, { foreignKey: 'cartId' });
//     Product.hasMany(CartProduct, { foreignKey: 'productId' });
// }

import { User } from './user';
import { Cart } from './cart';
// import { Cart } from './cart';
import { Product } from './product';
import { CartProduct } from './cart-product';
import { Payment } from './payment';

export function AssociateAllModels() {
    // User-Cart Association
    User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Cart.belongsTo(User, { foreignKey: 'userId' });

    // Cart-Product Association
    Cart.belongsToMany(Product, { through: CartProduct, foreignKey: 'cartId' });
    Product.belongsToMany(Cart, { through: CartProduct, foreignKey: 'productId' });
    CartProduct.belongsTo(Cart, { foreignKey: 'cartId' });
    CartProduct.belongsTo(Product, { foreignKey: 'productId' });

    // User-Payment Association
    User.hasMany(Payment, { foreignKey: 'userId' });
    Payment.belongsTo(User, { foreignKey: 'userId' });
}