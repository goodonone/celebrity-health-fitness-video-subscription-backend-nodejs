import { Model, DataTypes, Sequelize } from "sequelize";
import { Product } from './product';
import { Cart } from './cart';

export class CartProduct extends Model {
    declare cartId: number;
    declare productId: number;
    declare itemQuantity: number;
}

export function CartProductFactory(sequelize: Sequelize) {
    CartProduct.init({
        // Define your fields here with types and references
        cartId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'cart',
                key: 'cartId',
            }
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'product',
                key: 'productId',
            }
        },
        itemQuantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                validate: { min: 1 }
        }
    }, 
        {
        tableName: 'cart_products',
        freezeTableName: true,
        sequelize
    })
};

export function AssociateCartProduct() {
    Cart.belongsToMany(Product, {through: CartProduct, foreignKey: 'cartId'});
    Product.belongsToMany(Cart, {through: CartProduct, foreignKey: 'productId'});
}
