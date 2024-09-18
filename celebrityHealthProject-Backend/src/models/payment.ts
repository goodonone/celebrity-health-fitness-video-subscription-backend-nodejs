import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import {User} from "./user";
import { Snowflake } from "nodejs-snowflake";


const idGenerator = new Snowflake({
    custom_epoch: 1725148800000, 
    instance_id: 1 
  });

  function generateSnowflakeId(): string {
    return idGenerator.getUniqueID().toString();
  }

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>>{
    declare paymentId: string;
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

export function PaymentFactory(sequelize: Sequelize): typeof Payment {
    Payment.init({
        paymentId: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: generateSnowflakeId 
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tier: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        paymentType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // paymentFrequency: {
        //     type: DataTypes.STRING,
        //     allowNull: true
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

    return Payment;
}


// export function AssociateUserPayment() {
//     User.hasMany(Payment, { foreignKey: 'userId' });
//     Payment.belongsTo(User, { foreignKey: 'userId' });

// }

