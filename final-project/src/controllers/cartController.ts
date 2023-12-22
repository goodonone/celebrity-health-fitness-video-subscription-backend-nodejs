import { RequestHandler } from "express";
import { Cart } from "../models/cart";
import { Product } from "../models/product";
import { verifyToken } from "../services/auth";
import {User} from "../models/user";

//Get the user's cart
export const getCart: RequestHandler = async (req, res, next) => {
    let userId = req.params.userId;

    //let cartFound = await Cart.findByPk(userId);
    let cartFound = await Cart.findAll({ where: { userId } , 
        include: [{ model: Product,
        attributes: ['productName', 'productPrice'] 
    }]
});
    if (cartFound) {
        res.status(200).json(cartFound);
    }
    else {
        res.status(404).json('Cart not found');
    }
}

// Add a product to the cart
export const addToCart: RequestHandler = async (req, res, next) => {
    let { itemQuantity } = req.body;
    let { userId, productId} = req.params;
    console.log(req.body)
    console.log(userId, productId)
    if (userId && productId){
        let existingItem = await Cart.findOne({ where: { userId, productId } });
        // console.log(existingItem)
        if (existingItem) {
            console.log(existingItem.itemQuantity)
            existingItem.itemQuantity += itemQuantity;
            // console.log(itemQuantity)
            console.log(existingItem.itemQuantity)
            await existingItem.save();
            res.status(200).send('Item quantity updated');
        } else {
            // let newItem = await Cart.create({ userId, productId, itemQuantity });
            let newItem = await Cart.create({ userId, productId, itemQuantity } as any);
            res.status(201).json(newItem);
            console.log(newItem)
        }
    }
    else{
        res.status(400).send();
    }
}

//Remove a product from the cart
export const removeFromCart: RequestHandler = async (req, res, next) => {
    let { userId, productId } = req.params;
    if (userId && productId){
        let productFound = await Cart.findOne({ where: { userId, productId } });
        if (productFound){
            await Cart.destroy({ where: { userId, productId } });
            res.status(200).json();
        }
        else {
            res.status(404).json();
        }
    }
    else{
        res.status(400).send();
    }
}

//Clear the cart for a specific user
export const clearCart: RequestHandler = async (req, res, next) => {
    let userId = req.params.userId;
    if (!userId) {
        return res.status(400).json('User ID is required');
    }
    await Cart.destroy({ where: { userId } });
    res.status(200).json('Cart cleared successfully');
}


// Update the quantity of a prodcut in the cart
// export const updateQuantity: RequestHandler = async (req, res, next) => {
//     let { itemQuantity } = req.body;
//     let { userId, productId} = req.params;
//     console.log(req.body)
//     console.log(userId, productId)
//     if (userId && productId){
//         await Cart.update({ itemQuantity }, { where: { userId, productId } });
//         console.log(itemQuantity)
//         res.status(200).json();
//     }
//     else{
//         res.status(400).send();
//     }
// }

