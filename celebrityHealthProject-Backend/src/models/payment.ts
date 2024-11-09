import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
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
    declare paymentId: CreationOptional<string>;
    declare userId: string;
    declare tier: string;
    declare price: number;
    declare purchaseType: string; //subscription or store purchase
    declare paymentFrequency: string | null;
    declare shippingAddress: string | null;
    declare shippingZipcode: string | null;
    declare billingAddress: string | null;
    declare billingZipcode: string | null;
    declare createdAt?: Date;
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
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId'
            },
        },
        tier: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        purchaseType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentFrequency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        shippingAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        shippingZipcode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        billingAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        billingZipcode: {
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
        freezeTableName: true,
        tableName: 'payments',
        sequelize,
        modelName: 'Payment',
    });

    return Payment;
}


// export function AssociateUserPayment() {
//     User.hasMany(Payment, { foreignKey: 'userId' });
//     Payment.belongsTo(User, { foreignKey: 'userId' });

// }

