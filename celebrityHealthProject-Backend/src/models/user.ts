import { InferAttributes, InferCreationAttributes, Model, DataTypes, Sequelize } from "sequelize";
import {Cart} from "./cart";
import { Snowflake } from "nodejs-snowflake";
import bcrypt from 'bcrypt';
import { deleteImageFromFirebase } from '../utils/firebase.utils';

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
    declare profilePictureSettings: string | null;
    declare resetPasswordToken: string | null; 
    declare resetPasswordExpires: Date | null; 
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
            type: DataTypes.STRING(2048),
            allowNull: true,
            validate: {
                isUrl: true 
            }
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
        profilePictureSettings: {
            type: DataTypes.TEXT, 
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('profilePictureSettings');
                return rawValue ? JSON.parse(rawValue) : null;
            },
            set(value: any) {
                this.setDataValue('profilePictureSettings', JSON.stringify(value));
            }
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
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
        modelName: 'User',
        hooks: {
            beforeDestroy: async (user: User) => {
                // If implementing image deletion from Firebase
                if (user.imgUrl) {
                    try {
                        // You'll implement this function to delete from Firebase
                        await deleteImageFromFirebase(user.imgUrl);
                    } catch (error) {
                        console.error('Error deleting image from Firebase:', error);
                        // Decide if you want to throw the error or continue
                    }
                }
            },
            beforeUpdate: async (user: User) => {
                // If the image URL is changing, clean up the old one
                if (user.changed('imgUrl')) {
                    const oldUrl = user.previous('imgUrl');
                    if (oldUrl && oldUrl !== user.imgUrl) {
                        try {
                            await deleteImageFromFirebase(oldUrl);
                        } catch (error) {
                            console.error('Error deleting old image from Firebase:', error);
                        }
                    }
                }
            }
        },
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
