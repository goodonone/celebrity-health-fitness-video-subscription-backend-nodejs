// import { RequestHandler } from "express";
// import { Payment } from "../models/payment";
// import { verifyToken } from "../services/auth";
// import {User} from "../models/user";


// export const createPayment: RequestHandler = async (req, res, next) => {

//     let newPayment: Payment = req.body;
   
//     if (newPayment.userId && newPayment.tier) {
//         let created = await Payment.create(newPayment);
//         res.status(201).json(created);
//     }
//     else {
//         res.status(400).send();
//     }
// }

// export const createStorePayment: RequestHandler = async (req, res, next) => {
    

//     let newPayment: Payment = req.body;
    
//         let created = await Payment.create(newPayment);
//         res.status(201).json(created);
    
// }

// export const updatePayment: RequestHandler = async (req, res, next) => {
  
    
//     let userId = req.params.userId;
//     let newPayment: Payment = req.body;
//     let paymentId = newPayment.paymentId;
//     let paymentFound = await Payment.findByPk(paymentId);
   
//     if (paymentFound 
       
//         ) {
//             if (paymentFound.userId == userId) 
//             {    
//                 await Payment.update(newPayment, {
//                     where: { paymentId: paymentId }
//                 });
//                 res.status(200).json();
//             }
//             else{
//                 res.status(403).send();
//             }
//     }
//     else {
//         res.status(400).json();
//     }
// }

// export const updatePaymentforSubsciption: RequestHandler = async (req, res, next) => {
  
    
//     let userId = req.params.userId;
//     let newPayment: Payment = req.body;
//     let paymentId = newPayment.paymentId;
//     let paymentFound = await Payment.findOne({
//         where: {
//             userId: userId,
//             paymentType: 'subscription'
//         }
//     });

//     if (paymentFound) {    
//             await Payment.update(newPayment, {
//                 where: { paymentId: paymentFound.paymentId }
//             });
//             res.status(200).json({ message: 'Payment updated successfully.' });
//         }
//     else {
//         res.status(400).json({ message: 'Payment not found.' });
//     }
// }


import { RequestHandler } from "express";
import { Payment } from "../models/payment";
import { verifyToken } from "../services/auth";
import { User } from "../models/user";

export const createPayment: RequestHandler = async (req, res, next) => {
    let newPayment: Payment = req.body;
    if (newPayment.userId && newPayment.tier) {
        try {
            let created = await Payment.create(newPayment);
            res.status(201).json(created);
        } catch (error) {
            console.error('Error creating payment:', error);
            res.status(500).json({ message: 'Error creating payment' });
        }
    } else {
        res.status(400).json({ message: 'UserId and tier are required' });
    }
}

export const createStorePayment: RequestHandler = async (req, res, next) => {
    let newPayment: Payment = req.body;
    try {
        let created = await Payment.create(newPayment);
        res.status(201).json(created);
    } catch (error) {
        console.error('Error creating store payment:', error);
        res.status(500).json({ message: 'Error creating store payment' });
    }
}

export const updatePayment: RequestHandler = async (req, res, next) => {
    let userId = req.params.userId;
    let newPayment: Partial<Payment> = req.body;
    let paymentId = newPayment.paymentId;

    try {
        let paymentFound = await Payment.findByPk(paymentId);
        
        if (paymentFound && paymentFound.userId === userId) {
            await Payment.update(newPayment, {
                where: { paymentId: paymentId }
            });
            res.status(200).json({ message: 'Payment updated successfully' });
        } else if (!paymentFound) {
            res.status(404).json({ message: 'Payment not found' });
        } else {
            res.status(403).json({ message: 'Unauthorized to update this payment' });
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Error updating payment' });
    }
}

export const updatePaymentForSubscription: RequestHandler = async (req, res, next) => {
    let userId = req.params.userId;
    let newPayment: Partial<Payment> = req.body;

    try {
        let paymentFound = await Payment.findOne({
            where: {
                userId: userId,
                paymentType: 'subscription'
            }
        });

        if (paymentFound) {
            await Payment.update(newPayment, {
                where: { paymentId: paymentFound.paymentId }
            });
            res.status(200).json({ message: 'Subscription payment updated successfully' });
        } else {
            res.status(404).json({ message: 'Subscription payment not found' });
        }
    } catch (error) {
        console.error('Error updating subscription payment:', error);
        res.status(500).json({ message: 'Error updating subscription payment' });
    }
}


