import { RequestHandler } from "express";
import { Cart } from "../models/cart";
import { Product } from "../models/product";
import { CartProduct } from '../models/cart-product';
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
// export const addToCart: RequestHandler = async (req, res, next) => {
//     let { itemQuantity } = req.body;
//     let { userId, productId} = req.params;
//     console.log(req.body)
//     console.log(userId, productId)
//     if (userId && productId){
//         let cart = await Cart.findOne({ where: {userId}})
//         if (!cart){// If the cart doesn't exist, create a new cart for this user
//             cart = await Cart.create({ userId } as any)
//         }
//                     // Create a cart for the new user
//         // interface CartCreationAttributes extends Omit<Cart, 'cartId'> {}
//         // let newCart = await Cart.create({
//         //     userId: created.userId // Use the ID from the created user
//         // }as any);
//             // cart = await Cart.create({ userId } as Omit<InferCreationAttributes<Cart>, 'cartId'>);
//             // let newUser: User = req.body;
//             // let created = await User.create(newUser);
//         }
        
//         // let existingItem = await Cart.findOne({ where: { userId, productId } });
//         let existingItem = await CartProduct.findOne({ where: {cartId: cart.cartId, productId: productId} })
//         // console.log(existingItem)
//         if (existingItem) {
//             // console.log(existingItem.itemQuantity)
//             existingItem.itemQuantity += itemQuantity;
//             // console.log(itemQuantity)
//             console.log(existingItem.itemQuantity)
//             await existingItem.save();
//             res.status(200).send('Item quantity updated');
//         } else {
//             // let newItem = await Cart.create({ userId, productId, itemQuantity });
//             let newItem = await Cart.create({ userId, productId, itemQuantity } as any);
//             res.status(201).json(newItem);
//             console.log(newItem)
//         }
//     }
//     else{
//         res.status(400).send();
//     }
// }
export const addToCart: RequestHandler = async (req, res) => {
    const { itemQuantity } = req.body; // Make sure to validate this is a number and greater than 0
    const { userId, productId } = req.params; // These should be strings if they are coming from the URL

    if (userId && productId) {
        try {
            // Find or create a cart for the user
            let [cart, cartCreated] = await Cart.findOrCreate({
                where: { userId: userId }
            });

            // Find an existing CartProduct entry
            let existingItem = await CartProduct.findOne({
                where: { cartId: cart.cartId, productId: productId }
            });

            if (existingItem) {
                // If the product is already in the cart, update the quantity
                existingItem.itemQuantity += parseInt(itemQuantity, 10); // Assuming itemQuantity is a string from req.body
                await existingItem.save();
                res.status(200).send('Item quantity updated');
            } else {
                // If the product is not in the cart, add it to the cart
                let newItem = await CartProduct.create({
                    cartId: cart.cartId,
                    productId: productId,
                    itemQuantity: parseInt(itemQuantity, 10) // Make sure itemQuantity is treated as a number
                });
                res.status(201).json(newItem);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error when adding to cart');
        }
    } else {
        res.status(400).send('User ID and Product ID are required');
    }
};

// //Remove a product from the cart
// export const removeFromCart: RequestHandler = async (req, res, next) => {
//     let { userId, productId } = req.params;
//     if (userId && productId){
//         let productFound = await Cart.findOne({ where: { userId, productId } });
//         if (productFound){
//             await Cart.destroy({ where: { userId, productId } });
//             res.status(200).json();
//         }
//         else {
//             res.status(404).json();
//         }
//     }
//     else{
//         res.status(400).send();
//     }
// }

export const removeFromCart: RequestHandler = async (req, res) => {
    const { userId, productId } = req.params;

    if (userId && productId) {
        try {
            // First, find the user's cart
            const cart = await Cart.findOne({ where: { userId } });
            if (!cart) {
                return res.status(404).send('Cart not found.');
            }

            // Check if the product is in the user's cart
            const productInCart = await CartProduct.findOne({ 
                where: { 
                    cartId: cart.cartId, 
                    productId: productId 
                } 
            });

            if (productInCart) {
                // If the product is found in the cart, remove it
                await productInCart.destroy();
                res.status(200).send('Product removed from the cart.');
            } else {
                // If the product is not found in the cart, send a 404 response
                res.status(404).send('Product not found in the cart.');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error when trying to remove product from cart.');
        }
    } else {
        res.status(400).send('User ID and Product ID are required.');
    }
};

//Clear the cart for a specific user
// export const clearCart: RequestHandler = async (req, res, next) => {
//     let userId = req.params.userId;
//     if (!userId) {
//         return res.status(400).json('User ID is required');
//     }
//     await Cart.destroy({ where: { userId } });
//     res.status(200).json('Cart cleared successfully');
// }
export const clearCart: RequestHandler = async (req, res) => {
    let userId = req.params.userId;
    if (!userId) {
        return res.status(400).json('User ID is required');
    }

    // Find the user's cart
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
        return res.status(404).json('Cart not found');
    }

    // Clear all products from the cart
    await CartProduct.destroy({ where: { cartId: cart.cartId } });
    res.status(200).json('Cart cleared successfully');
};

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
// export const updateQuantity: RequestHandler = async (req, res) => {
//     let { itemQuantity } = req.body;
//     let { userId, productId } = req.params;

//     if (userId && productId) {
//         const cart = await Cart.findOne({ where: { userId } });
//         if (!cart) {
//             return res.status(404).json('Cart not found');
//         }

//         const updated = await CartProduct.update(
//             { itemQuantity },
//             { where: { cartId: cart.cartId, productId } }
//         );

//         if (updated[0] > 0) {
//             res.status(200).json('Quantity updated successfully');
//         } else {
//             res.status(404).json('Product not found in cart');
//         }
//     } else {
//         res.status(400).send('User ID and Product ID are required');
//     }
// };
