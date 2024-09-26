import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
import {Cart} from "./cart";
import { Snowflake } from "nodejs-snowflake";
import bcrypt from 'bcrypt';

// Initialize Snowflake ID generator
const uid = new Snowflake({
    custom_epoch: 1725148800000, 
    instance_id: 1
  });

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>{
    declare userId: string;
    declare email: string;
    declare password: string | null;
    declare isGoogleAuth: boolean;
    declare name: string;
    declare weight: string | null;
    declare height: string | null;
    declare gender: string | null;
    declare goals: string | null;
    declare tier: string | null;
    declare dateOfBirth: string;
    declare imgUrl: string | null;
    declare price: number | null;
    declare paymentFrequency: string | null;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    
}

export function UserFactory(sequelize: Sequelize): typeof User {
    User.init({
        userId: {
            type: DataTypes.STRING, // Changed to STRING
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uid.getUniqueID().toString() // Generate Snowflake ID
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [8, 100]
            }
        },
        isGoogleAuth: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
            allowNull: false,
            defaultValue: 'Just Looking'
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
            allowNull: false,
            defaultValue: 'monthly'
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
        modelName: 'User',
        // hooks: {
        //     beforeCreate: async (user: User) => {
        //         if (user.password) {
        //             user.password = await bcrypt.hash(user.password, 10);
        //         }
        //     },
        //     beforeUpdate: async (user: User) => {
        //         if (user.changed('password')) {
        //             user.password = await bcrypt.hash(user.password, 10);
        //         }
        //     }
        // }
    });

    return User;
}

// export function AssociateCartUser() {
//     User.hasOne(Cart, { foreignKey: 'userId' });
//     Cart.belongsTo(User, { foreignKey: 'userId' });
// }


//     Cart.hasOne(User,{ foreignKey: 'userId'})
//     User.belongsTo(Cart, { foreignKey: 'userId' })
//     // User.hasOne(Cart, { foreignKey: 'userId' });
//     // Cart.belongsTo(User, { foreignKey: 'userId' })
// //    // Cart.belongsTo(Product, { foreignKey: 'productId' });
// }
