import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import {User} from "./user";

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>>{
    declare paymentId: number;
    declare userId: string;
    declare tier: string;
    declare price: number;
    declare paymentType: string; //subscription or purchased
    // declare paymentFrequency: string;
    // declare paymentStatus: string;
    // declare membershipStatus: string;
    declare createdAt?: Date;//membershipDate
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
            type: DataTypes.STRING,
            allowNull: false
        },
        tier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        paymentType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // paymentFrequency: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        // paymentStatus: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        // membershipStatus: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
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
        tableName: 'payments',
        sequelize
    });
}

export function AssociateUserPayment() {
    User.hasMany(Payment, { foreignKey: 'userId' });
    Payment.belongsTo(User, { foreignKey: 'userId' });
}

