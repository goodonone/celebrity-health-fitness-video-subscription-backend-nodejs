import { RequestHandler } from "express";
import { Payment } from "../models/payment";
import { verifyToken } from "../services/auth";
import {User} from "../models/user";


export const createPayment: RequestHandler = async (req, res, next) => {
    // let user: User | null = await verifyToken(req);

    // if (!user){
    //     return res.status(403).send(); //403 forbidden if user is not logged in 
    // }

    let newPayment: Payment = req.body;
    // newPayment.userId = user.userId;
    if (newPayment.userId && newPayment.tier) {
        let created = await Payment.create(newPayment);
        res.status(201).json(created);
    }
    else {
        res.status(400).send();
    }
}

export const updatePayment: RequestHandler = async (req, res, next) => {
    // let user: User | null = await verifyToken(req);

    // if (!user){
    //     return res.status(403).send(); //403 forbidden if user is not logged in 
    // }
    
    let userId = req.params.userId;
    let newPayment: Payment = req.body;
    let paymentId = newPayment.paymentId;
    let paymentFound = await Payment.findByPk(paymentId);
    // console.log(userId)
    // console.log(newPayment)
    // console.log(paymentId)
    // console.log(paymentFound)
    if (paymentFound 
        //&& paymentFound.paymentId == newPayment.paymentId
        //&& newPayment.paymentType 
        ) {
            if (paymentFound.userId == userId ) 
            {    
                await Payment.update(newPayment, {
                    where: { paymentId: paymentId }
                });
                res.status(200).json();
            }
            else{
                res.status(403).send();
            }
    }
    else {
        res.status(400).json();
    }
}

export const updatePaymentforSubsciption: RequestHandler = async (req, res, next) => {
    // let user: User | null = await verifyToken(req);

    // if (!user){
    //     return res.status(403).send(); //403 forbidden if user is not logged in 
    // }
    
    let userId = req.params.userId;
    let newPayment: Payment = req.body;
    let paymentId = newPayment.paymentId;
    // let paymentFound = await Payment.findByPk(paymentId);
    let paymentFound = await Payment.findOne({
        where: {
            userId: userId,
            paymentType: 'subscription'
        }
    });
    // console.log(userId)
    // console.log(newPayment)
    // console.log(paymentId)
    // console.log(paymentFound)
    if (paymentFound) {    
            await Payment.update(newPayment, {
                where: { paymentId: paymentFound.paymentId }
            });
            res.status(200).json({ message: 'Payment updated successfully.' });
        }
    else {
        res.status(400).json({ message: 'Payment not found.' });
    }
}

// export const getAllPayments: RequestHandler = async (req, res, next) => {
//     let payments = await Payment.findAll();
//     res.status(200).json(payments);
// }

// export const getPayment: RequestHandler = async (req, res, next) => {
//     let paymentId = req.params.paymentId;
//     let paymentFound = await Payment.findByPk(paymentId);
//     if (paymentFound) {
//         res.status(200).json(paymentFound);
//     }
//     else {
//         res.status(404).json();
//     }
// }

