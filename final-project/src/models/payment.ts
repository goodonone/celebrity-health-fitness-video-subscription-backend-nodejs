import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import {User} from "./user";

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>>{
    declare paymentId: number;
    declare userId: number;
    declare Tier: string;
    declare membershipDate?: Date;//createdAt
    declare updatedAt?: Date;
}
// Stripe code needs to be added here

export function ProfileFactory(sequelize: Sequelize) {
    Profile.init({
        profileId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        DateOfBirth: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Weight: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Height: {
            type: DataTypes.STRING,
            allowNull: false
        },
        BodyMassIndex: {
            type: DataTypes.STRING,
            allowNull: false
        },
        DietaryPreference: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Goals: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Tier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        freezeTableName: true,
        tableName: 'profiles',
        sequelize
    });
}

export function AssociateUserMessage() {
    User.hasMany(Payment, { foreignKey: 'userId' });
    Payment.belongsTo(User, { foreignKey: 'userId' });
}