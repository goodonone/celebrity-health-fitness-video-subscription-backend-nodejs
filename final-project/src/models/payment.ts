import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import {User} from "./user";

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>>{
    declare paymentId: number;
    declare userId: number;
    declare Tier: string;
    declare paymentStatus: string;
    declare membershipStatus: string;
    declare paymentFrequency: string;
    declare membershipDate?: Date;//createdAt
    declare updatedAt?: Date;
}

export function PaymentFactory(sequelize: Sequelize) {
    Payment.init({
        paymentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Tier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        paymentStatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        membershipStatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        paymentFrequency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        membershipDate: {
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
        tableName: 'payments',
        sequelize
    });
}

export function AssociateUserMessage() {
    User.hasMany(Payment, { foreignKey: 'userId' });
    Payment.belongsTo(User, { foreignKey: 'paymentId' });
}