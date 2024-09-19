

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

// import { User } from './user';
// import { Cart } from './cart';
// // import { Cart } from './cart';
// import { Product } from './product';
// import { CartProduct } from './cart-product';
// import { Payment } from './payment';

// export function AssociateAllModels() {
//     User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
//     Cart.belongsTo(User, { foreignKey: 'userId' });

//     Cart.belongsToMany(Product, { through: CartProduct, foreignKey: 'cartId' });
//     Product.belongsToMany(Cart, { through: CartProduct, foreignKey: 'productId' });
//     CartProduct.belongsTo(Cart, { foreignKey: 'cartId' });
//     CartProduct.belongsTo(Product, { foreignKey: 'productId' });

//     User.hasMany(Payment, { foreignKey: 'userId' });
//     Payment.belongsTo(User, { foreignKey: 'userId' });
// }

// import { Sequelize } from 'sequelize';
// import { User, UserFactory } from './user';
// import { Cart, CartFactory } from './cart';
// import { Product, ProductFactory } from './product';
// import { CartProduct, CartProductFactory } from './cart-product';
// import { Payment, PaymentFactory } from './payment';

// export function AssociateAllModels(sequelize: Sequelize) {
//     const UserModel = UserFactory(sequelize);
//     const CartModel = CartFactory(sequelize);
//     const ProductModel = ProductFactory(sequelize);
//     const CartProductModel = CartProductFactory(sequelize);
//     const PaymentModel = PaymentFactory(sequelize);

//     UserModel.hasOne(CartModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
//     CartModel.belongsTo(UserModel, { foreignKey: 'userId' });

//     CartModel.belongsToMany(ProductModel, { through: CartProductModel, foreignKey: 'cartId' });
//     ProductModel.belongsToMany(CartModel, { through: CartProductModel, foreignKey: 'productId' });
//     CartProductModel.belongsTo(CartModel, { foreignKey: 'cartId' });
//     CartProductModel.belongsTo(ProductModel, { foreignKey: 'productId' });

//     UserModel.hasMany(PaymentModel, { foreignKey: 'userId' });
//     PaymentModel.belongsTo(UserModel, { foreignKey: 'userId' });

//     return {
//         User: UserModel,
//         Cart: CartModel,
//         Product: ProductModel,
//         CartProduct: CartProductModel,
//         Payment: PaymentModel
//     };
// }

import { Sequelize } from 'sequelize';
import { User, UserFactory } from './user';
import { Cart, CartFactory } from './cart';
import { Product, ProductFactory } from './product';
import { CartProduct, CartProductFactory } from './cart-product';
import { Payment, PaymentFactory } from './payment';

export function AssociateAllModels(sequelize: Sequelize) {
    const UserModel = UserFactory(sequelize);
    const CartModel = CartFactory(sequelize);
    const ProductModel = ProductFactory(sequelize);
    const CartProductModel = CartProductFactory(sequelize);
    const PaymentModel = PaymentFactory(sequelize);

    // User-Cart Association
    UserModel.hasOne(CartModel, { 
        foreignKey: 'userId', 
        as: 'Cart',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    CartModel.belongsTo(UserModel, { 
        foreignKey: 'userId',
        as: 'User',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // Cart-Product Association
    CartModel.belongsToMany(ProductModel, { 
        through: CartProductModel, 
        foreignKey: 'cartId',
        as: 'Products',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    ProductModel.belongsToMany(CartModel, { 
        through: CartProductModel, 
        foreignKey: 'productId',
        as: 'Carts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

      // CartProduct Associations
      CartModel.hasMany(CartProductModel, {
        foreignKey: 'cartId',
        as: 'CartProducts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // CartProduct Associations
    CartProductModel.belongsTo(CartModel, { 
        foreignKey: 'cartId',
        as: 'Cart',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    ProductModel.hasMany(CartProductModel, {
        foreignKey: 'productId',
        as: 'CartProducts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    CartProductModel.belongsTo(ProductModel, { 
        foreignKey: 'productId',
        as: 'Product',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // User-Payment Association
    UserModel.hasMany(PaymentModel, { 
        foreignKey: 'userId',
        as: 'Payments',
        onDelete: 'SET NULL',  // Changed from CASCADE to SET NULL
        onUpdate: 'CASCADE'
    });
    PaymentModel.belongsTo(UserModel, { 
        foreignKey: 'userId',
        as: 'User',
        onDelete: 'SET NULL',  // Changed from CASCADE to SET NULL
        onUpdate: 'CASCADE'
    });

    return {
        User: UserModel,
        Cart: CartModel,
        Product: ProductModel,
        CartProduct: CartProductModel,
        Payment: PaymentModel
    };
}