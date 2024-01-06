import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
import {Cart} from "./cart";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>{
    declare userId: number;
    declare email: string;
    declare password: string;
    declare name: string;
    declare weight: string;
    declare height: string;
    declare gender: string;
    declare goals: string;
    declare tier: string;
    declare dateOfBirth: string;
    declare imgUrl: string;
    declare price: number;
    declare paymentFrequency: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

export function UserFactory(sequelize: Sequelize) {
    User.init({
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        weight: {
            type: DataTypes.STRING,
            allowNull: true
        },
        height: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        goals: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imgUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        paymentFrequency: {
            type: DataTypes.STRING,
            allowNull: true
        },
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
        tableName: 'users',
        freezeTableName: true,
        sequelize,
        // hooks: {
        //     beforeCreate: (user, options) => {
        //         //user.userId = 'user-' + Math.random().toString(18).substr(2, 9);
        //         user.userId = Math.random().toString(18).slice(2);
        //     }
        // }
    });
}

// export function AssociateCartUser() {
// //     //Cart.hasOne(User, { foreignKey: 'userId' });
// //     //User.belongsTo(Cart, { foreignKey: 'userId' });
//     Cart.hasOne(User,{ foreignKey: 'userId'})
//     User.belongsTo(Cart, { foreignKey: 'userId' })
//     // User.hasOne(Cart, { foreignKey: 'userId' });
//     // Cart.belongsTo(User, { foreignKey: 'userId' })
// //    // Cart.belongsTo(Product, { foreignKey: 'productId' });
// }
