import { RequestHandler } from "express";
import { Payment } from "../models/payment";
import { verifyToken } from "../services/auth";
import {User} from "../models/user";

export const getAllPayments: RequestHandler = async (req, res, next) => {
    let payments = await Payment.findAll();
    res.status(200).json(payments);
}

export const getPayment: RequestHandler = async (req, res, next) => {
    let paymentId = req.params.paymentId;
    let paymentFound = await Payment.findByPk(paymentId);
    if (paymentFound) {
        res.status(200).json(paymentFound);
    }
    else {
        res.status(404).json();
    }
}

// export const createPayment: RequestHandler = async (req, res, next) => {
//     let user: User | null = await verifyToken(req);

//     if (!user){
//         return res.status(403).send(); //403 forbidden if user is not logged in 
//     }

//     let newPayment: Payment = req.body;
//     newPayment.userId = user.userId;
//     if (newPayment.DateOfBirth) {
//         let created = await Payment.create(newPayment);
//         res.status(201).json(created);
//     }
//     else {
//         res.status(400).send();
//     }
// }

export const updatePayment: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyToken(req);

    if (!user){
        return res.status(403).send(); //403 forbidden if user is not logged in 
    }
    
    let paymentId = req.params.paymentId;
    let newPayment: Payment = req.body;
    
    let paymentFound = await Payment.findByPk(paymentId);
    
    if (paymentFound && paymentFound.paymentId == newPayment.paymentId
        && newPayment.paymentStatus ) {
            if (paymentFound.userId == user.userId ) 
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

