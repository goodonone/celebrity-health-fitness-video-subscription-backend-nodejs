import { RequestHandler } from "express";
import { Payment } from "../models/payment";
import { ValidationError, DatabaseError } from "sequelize";

export const createPayment: RequestHandler = async (req, res, next) => {
    console.log('Received payment data:', req.body);
    let newPayment = req.body;
    if (newPayment.userId && newPayment.tier) {
        try {
            let created = await Payment.create({
                userId: newPayment.userId,
                tier: newPayment.tier,
                price: newPayment.price,
                purchaseType: newPayment.paymentType || 'subscription',
                paymentFrequency: newPayment.paymentFrequency,
                billingAddress: newPayment.billingAddress,
                billingZipcode: newPayment.billingZipcode,
                shippingAddress: newPayment.shippingAddress,
                shippingZipcode: newPayment.shippingZipcode
            });
            console.log('Created payment:', created.toJSON());
            res.status(201).json(created);
        } catch (error: unknown) {
            console.error('Error creating payment:', error);
            if (error instanceof ValidationError) {
                res.status(400).json({ message: 'Validation error', errors: error.errors });
            } else if (error instanceof DatabaseError) {
                res.status(500).json({ message: 'Database error', error: error.message });
            } else if (error instanceof Error) {
                res.status(500).json({ message: 'Error creating payment', error: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    } else {
        res.status(400).json({ message: 'UserId and tier are required' });
    }
};