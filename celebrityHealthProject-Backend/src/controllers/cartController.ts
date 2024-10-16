// import { RequestHandler } from "express";
// import { Cart } from "../models/cart";
// import { Product } from "../models/product";
// import { CartProduct } from '../models/cart-product';
// import { verifyToken } from "../services/auth";
// import {User} from "../models/user";

// //Get the user's cart
// export const getCart: RequestHandler = async (req, res, next) => {
//     let userId = req.params.userId;

//     //let cartFound = await Cart.findByPk(userId);
//     let cartFound = await Cart.findAll({ where: { userId } , 
//         include: [{ model: Product,
//         attributes: ['productName', 'productPrice'] 
//     }]
// });
//     if (cartFound) {
//         res.status(200).json(cartFound);
//     }
//     else {
//         res.status(404).json('Cart not found');
//     }
// }

// // Add a product to the cart
// // export const addToCart: RequestHandler = async (req, res, next) => {
// //     let { itemQuantity } = req.body;
// //     let { userId, productId} = req.params;
// //     console.log(req.body)
// //     console.log(userId, productId)
// //     if (userId && productId){
// //         let cart = await Cart.findOne({ where: {userId}})
// //         if (!cart){// If the cart doesn't exist, create a new cart for this user
// //             cart = await Cart.create({ userId } as any)
// //         }
// //                     // Create a cart for the new user
// //         // interface CartCreationAttributes extends Omit<Cart, 'cartId'> {}
// //         // let newCart = await Cart.create({
// //         //     userId: created.userId // Use the ID from the created user
// //         // }as any);
// //             // cart = await Cart.create({ userId } as Omit<InferCreationAttributes<Cart>, 'cartId'>);
// //             // let newUser: User = req.body;
// //             // let created = await User.create(newUser);
// //         }
        
// //         // let existingItem = await Cart.findOne({ where: { userId, productId } });
// //         let existingItem = await CartProduct.findOne({ where: {cartId: cart.cartId, productId: productId} })
// //         // console.log(existingItem)
// //         if (existingItem) {
// //             // console.log(existingItem.itemQuantity)
// //             existingItem.itemQuantity += itemQuantity;
// //             // console.log(itemQuantity)
// //             console.log(existingItem.itemQuantity)
// //             await existingItem.save();
// //             res.status(200).send('Item quantity updated');
// //         } else {
// //             // let newItem = await Cart.create({ userId, productId, itemQuantity });
// //             let newItem = await Cart.create({ userId, productId, itemQuantity } as any);
// //             res.status(201).json(newItem);
// //             console.log(newItem)
// //         }
// //     }
// //     else{
// //         res.status(400).send();
// //     }
// // }
// export const addToCart: RequestHandler = async (req, res) => {
//     const { itemQuantity } = req.body; // Make sure to validate this is a number and greater than 0
//     const { userId, productId } = req.params; // These should be strings if they are coming from the URL

//     if (userId && productId) {
//         try {
//             // Find or create a cart for the user
//             let [cart, cartCreated] = await Cart.findOrCreate({
//                 where: { userId: userId }
//             });

//             // Find an existing CartProduct entry
//             let existingItem = await CartProduct.findOne({
//                 where: { cartId: cart.cartId, productId: productId }
//             });

//             if (existingItem) {
//                 // If the product is already in the cart, update the quantity
//                 existingItem.itemQuantity += parseInt(itemQuantity, 10); // Assuming itemQuantity is a string from req.body
//                 await existingItem.save();
//                 res.status(200).send('Item quantity updated');
//             } else {
//                 // If the product is not in the cart, add it to the cart
//                 let newItem = await CartProduct.create({
//                     cartId: cart.cartId,
//                     productId: productId,
//                     itemQuantity: parseInt(itemQuantity, 10) // Make sure itemQuantity is treated as a number
//                 });
//                 res.status(201).json(newItem);
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).send('Server error when adding to cart');
//         }
//     } else {
//         res.status(400).send('User ID and Product ID are required');
//     }
// };

// // //Remove a product from the cart
// // export const removeFromCart: RequestHandler = async (req, res, next) => {
// //     let { userId, productId } = req.params;
// //     if (userId && productId){
// //         let productFound = await Cart.findOne({ where: { userId, productId } });
// //         if (productFound){
// //             await Cart.destroy({ where: { userId, productId } });
// //             res.status(200).json();
// //         }
// //         else {
// //             res.status(404).json();
// //         }
// //     }
// //     else{
// //         res.status(400).send();
// //     }
// // }

// export const removeFromCart: RequestHandler = async (req, res) => {
//     const { userId, productId } = req.params;

//     if (userId && productId) {
//         try {
//             // First, find the user's cart
//             const cart = await Cart.findOne({ where: { userId } });
//             if (!cart) {
//                 return res.status(404).send('Cart not found.');
//             }

//             // Check if the product is in the user's cart
//             const productInCart = await CartProduct.findOne({ 
//                 where: { 
//                     cartId: cart.cartId, 
//                     productId: productId 
//                 } 
//             });

//             if (productInCart) {
//                 // If the product is found in the cart, remove it
//                 await productInCart.destroy();
//                 res.status(200).send('Product removed from the cart.');
//             } else {
//                 // If the product is not found in the cart, send a 404 response
//                 res.status(404).send('Product not found in the cart.');
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).send('Server error when trying to remove product from cart.');
//         }
//     } else {
//         res.status(400).send('User ID and Product ID are required.');
//     }
// };

// //Clear the cart for a specific user
// // export const clearCart: RequestHandler = async (req, res, next) => {
// //     let userId = req.params.userId;
// //     if (!userId) {
// //         return res.status(400).json('User ID is required');
// //     }
// //     await Cart.destroy({ where: { userId } });
// //     res.status(200).json('Cart cleared successfully');
// // }
// export const clearCart: RequestHandler = async (req, res) => {
//     let userId = req.params.userId;
//     if (!userId) {
//         return res.status(400).json('User ID is required');
//     }

//     // Find the user's cart
//     const cart = await Cart.findOne({ where: { userId } });
//     if (!cart) {
//         return res.status(404).json('Cart not found');
//     }

//     // Clear all products from the cart
//     await CartProduct.destroy({ where: { cartId: cart.cartId } });
//     res.status(200).json('Cart cleared successfully');
// };

// // Update the quantity of a prodcut in the cart
// // export const updateQuantity: RequestHandler = async (req, res, next) => {
// //     let { itemQuantity } = req.body;
// //     let { userId, productId} = req.params;
// //     console.log(req.body)
// //     console.log(userId, productId)
// //     if (userId && productId){
// //         await Cart.update({ itemQuantity }, { where: { userId, productId } });
// //         console.log(itemQuantity)
// //         res.status(200).json();
// //     }
// //     else{
// //         res.status(400).send();
// //     }
// // }
// // export const updateQuantity: RequestHandler = async (req, res) => {
// //     let { itemQuantity } = req.body;
// //     let { userId, productId } = req.params;

// //     if (userId && productId) {
// //         const cart = await Cart.findOne({ where: { userId } });
// //         if (!cart) {
// //             return res.status(404).json('Cart not found');
// //         }

// //         const updated = await CartProduct.update(
// //             { itemQuantity },
// //             { where: { cartId: cart.cartId, productId } }
// //         );

// //         if (updated[0] > 0) {
// //             res.status(200).json('Quantity updated successfully');
// //         } else {
// //             res.status(404).json('Product not found in cart');
// //         }
// //     } else {
// //         res.status(400).send('User ID and Product ID are required');
// //     }
// // };

import { RequestHandler } from "express";
import { Cart } from "../models/cart";
import { Product } from "../models/product";
import { CartProduct } from '../models/cart-product';
import { verifyToken } from "../services/auth";
import { User } from "../models/user";
import { Snowflake } from "nodejs-snowflake";

// Initialize Snowflake ID generator (you might want to move this to a separate file)
const uid = new Snowflake({
    custom_epoch: 1725148800000, 
    instance_id: 1
});


// Get the user's cart
// export const getCart: RequestHandler = async (req, res, next) => {
//     let userId = req.params.userId;

//     let cartFound = await Cart.findAll({ 
//         where: { userId },
//         include: [{ 
//             model: Product,
//             attributes: ['productName', 'productPrice'] 
//         }]
//     });
//     if (cartFound) {
//         res.status(200).json(cartFound);
//     } else {
//         res.status(404).json('Cart not found');
//     }
// }
// export const getCart: RequestHandler = async (req, res, next) => {
//     let userId = req.params.userId;

//     try {
//         let cartFound = await Cart.findOne({ 
//             where: { userId },
//             include: [{ 
//                 model: CartProduct,
//                 as: 'CartProducts',
//                 include: [{
//                     model: Product,
//                     as: 'Product'
//                 }]
//             }]
//         });

//         if (cartFound) {
//             // Calculate total quantity and total price for the cart
//             const totalCount = cartFound.CartProducts?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
//             const totalPrice = cartFound.CartProducts?.reduce((sum, item) => sum + item.quantity * (item.Product?.productPrice || 0), 0) ?? 0;

//             const cartResponse = {
//                 ...cartFound.toJSON(),
//                 totalCount,
//                 totalPrice
//             };

//             res.status(200).json(cartResponse);
//         } else {
//             res.status(404).json('Cart not found');
//         }
//     } catch (error) {
//         console.error('Error fetching cart:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// }

export const getCart: RequestHandler = async (req, res, next) => {
    let userId = req.params.userId;

    try {
        let cartFound = await Cart.findOne({ 
            where: { userId },
            include: [{ 
                model: CartProduct,
                as: 'CartProducts',
                include: [{
                    model: Product,
                    as: 'Product'
                }]
            }]
        });

        if (cartFound) {
            // Calculate total quantity and total price for the cart
            const totalCount = cartFound.CartProducts?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
            const totalPrice = cartFound.CartProducts?.reduce((sum, item) => sum + item.quantity * (item.Product?.productPrice || 0), 0) ?? 0;

            const cartResponse = {
                ...cartFound.toJSON(),
                totalCount,
                totalPrice
            };

            res.status(200).json(cartResponse);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
}


// Add a product to the cart

// export const addToCart: RequestHandler = async (req, res) => {
//     const { quantity } = req.body;
//     const { userId, productId } = req.params;

//     if (userId && productId) {
//         try {
//             // Find or create a cart for the user
//             let [cart, cartCreated] = await Cart.findOrCreate({
//                 where: { userId: userId }
//             });

//             const now = new Date();

//             // Find an existing CartProduct entry
//             let [cartProduct, created] = await CartProduct.findOrCreate({
//                 where: { cartId: cart.cartId, productId: productId },
//                 defaults: {
//                     cartProductId: uid.getUniqueID().toString(),
//                     cartId: cart.cartId,
//                     productId: productId,
//                     quantity: parseInt(quantity, 10),
//                     createdAt: now,
//                     updatedAt: now
//                 }
//             });

//             if (!created) {
//                 // If the product is already in the cart, update the quantity
//                 cartProduct.quantity += parseInt(quantity, 10);
//                 cartProduct.updatedAt = now;
//                 await cartProduct.save();
//             }

//             res.status(created ? 201 : 200).json(cartProduct);
//         } catch (error) {
//             console.error(error);
//             res.status(500).send('Server error when adding to cart');
//         }
//     } else {
//         res.status(400).send('User ID and Product ID are required');
//     }
// };

// export const addToCart: RequestHandler = async (req, res) => {
//     const { quantity } = req.body;
//     const { userId, productId } = req.params;

//     if (userId && productId) {
//         try {
//             // Find or create a cart for the user
//             let [cart, cartCreated] = await Cart.findOrCreate({
//                 where: { userId: userId }
//             });

//             const now = new Date();

//             // Find an existing CartProduct entry or create one
//             let [cartProduct, created] = await CartProduct.findOrCreate({
//                 where: { cartId: cart.cartId, productId: productId },
//                 defaults: {
//                     cartProductId: uid.getUniqueID().toString(),
//                     cartId: cart.cartId,
//                     productId: productId,
//                     quantity: parseInt(quantity, 10),
//                     createdAt: now,
//                     updatedAt: now
//                 }
//             });

//             if (!created) {
//                 // If the product is already in the cart, update the quantity
//                 cartProduct.quantity += parseInt(quantity, 10);
//                 cartProduct.updatedAt = now;
//                 await cartProduct.save();
//             }

//             // Fetch the updated cart with all items and associated products
//             // const updatedCart = await Cart.findOne({
//             //     where: { cartId: cart.cartId },
//             //     include: [
//             //         {
//             //             model: CartProduct,
//             //             include: [Product] // Ensure the associated Product is fetched
//             //         }
//             //     ]
//             // });
//             const updatedCart = await Cart.findOne({
//                 where: { cartId: cart.cartId },
//                 include: [
//                     {
//                         model: CartProduct,
//                         as: 'cartProducts',
//                         include: [{
//                             model: Product,
//                             as: 'product'
//                         }]
//                     }
//                 ]
//             });

//             // Calculate total quantity and total price for the cart
//             // const totalCount = updatedCart!.CartProducts?.reduce((sum: number, item: CartProduct) => sum + item.quantity, 0) ?? 0;
//             // const totalCount = updatedCart!.cartProducts?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

//             // Access the Product and its price via the association
//             // const totalPrice = updatedCart!.CartProducts?.reduce((sum: number, item: CartProduct) => {


//             //     return sum + item.quantity * (item.Product?.productPrice || 0);
//             // }, 0) ?? 0;

//             // Calculate total quantity and total price for the cart
//             const totalCount = updatedCart!.CartProducts?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
//             // Access the Product and its price via the association
//             const totalPrice = updatedCart!.CartProducts?.reduce((sum, item) => sum + item.quantity * (item.Product?.productPrice || 0), 0) ?? 0;

//             // Add total count and price to the response
//             const fullCartResponse = {
//                 ...updatedCart!.toJSON(),  // Include all cart details
//                 totalCount,
//                 totalPrice
//             };

//             res.status(created ? 201 : 200).json(fullCartResponse);  // Return full cart with details
//         } catch (error) {
//             console.error(error);
//             res.status(500).send('Server error when adding to cart');
//         }
//     } else {
//         res.status(400).send('User ID and Product ID are required');
//     }
// };

// export const addToCart: RequestHandler = async (req, res) => {
//     const { quantity } = req.body;
//     const { userId, productId } = req.params;

//     if (userId && productId) {
//         try {
//             // Find or create a cart for the user
//             let [cart, cartCreated] = await Cart.findOrCreate({
//                 where: { userId: userId }
//             });

//             const now = new Date();

//             // Find an existing CartProduct entry or create one
//             let [cartProduct, created] = await CartProduct.findOrCreate({
//                 where: { cartId: cart.cartId, productId: productId },
//                 defaults: {
//                     cartProductId: uid.getUniqueID().toString(),
//                     cartId: cart.cartId,
//                     productId: productId,
//                     quantity: parseInt(quantity, 10),
//                     createdAt: now,
//                     updatedAt: now
//                 }
//             });

//             if (!created) {
//                 // If the product is already in the cart, update the quantity
//                 cartProduct.quantity += parseInt(quantity, 10);
//                 cartProduct.updatedAt = now;
//                 await cartProduct.save();
//             }

//             // Fetch the updated cart with all items and associated products
//             const updatedCart = await Cart.findOne({
//                 where: { cartId: cart.cartId },
//                 include: [
//                     {
//                         model: CartProduct,
//                         as: 'CartProducts',
//                         include: [{
//                             model: Product,
//                             as: 'Product'
//                         }]
//                     }
//                 ]
//             });

//             // Calculate total quantity and total price for the cart
//             const totalCount = updatedCart!.CartProducts?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
//             const totalPrice = updatedCart!.CartProducts?.reduce((sum, item) => sum + item.quantity * (item.Product?.productPrice || 0), 0) ?? 0;

//             // Add total count and price to the response
//             const fullCartResponse = {
//                 ...updatedCart!.toJSON(),
//                 totalCount,
//                 totalPrice
//             };

//             res.status(created ? 201 : 200).json(fullCartResponse);
//         } catch (error) {
//             console.error('Error adding to cart:', error);
//             res.status(500).json({ message: 'Server error when adding to cart', error: error.message });
//         }
//     } else {
//         res.status(400).json({ message: 'User ID and Product ID are required' });
//     }
// };

export const addToCart: RequestHandler = async (req, res) => {
    const { quantity } = req.body;
    const { userId, productId } = req.params;

    if (userId && productId) {
        try {
            // Find or create a cart for the user
            let [cart, cartCreated] = await Cart.findOrCreate({
                where: { userId: userId }
            });

            const now = new Date();

            // Find an existing CartProduct entry or create one
            let [cartProduct, created] = await CartProduct.findOrCreate({
                where: { cartId: cart.cartId, productId: productId },
                defaults: {
                    cartProductId: uid.getUniqueID().toString(),
                    cartId: cart.cartId,
                    productId: productId,
                    quantity: parseInt(quantity, 10),
                    createdAt: now,
                    updatedAt: now
                }
            });

            if (!created) {
                // If the product is already in the cart, update the quantity
                cartProduct.quantity += parseInt(quantity, 10);
                cartProduct.updatedAt = now;
                await cartProduct.save();
            }

            // Fetch the updated cart with all items and associated products
            const updatedCart = await Cart.findOne({
                where: { cartId: cart.cartId },
                include: [
                    {
                        model: CartProduct,
                        as: 'CartProducts',
                        include: [{
                            model: Product,
                            as: 'Product'
                        }]
                    }
                ]
            });

            if (!updatedCart) {
                throw new Error("Failed to fetch updated cart");
            }

            // Calculate total quantity and total price for the cart
            const totalCount = updatedCart.CartProducts?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
            const totalPrice = updatedCart.CartProducts?.reduce((sum, item) => sum + item.quantity * (item.Product?.productPrice || 0), 0) ?? 0;

            // Add total count and price to the response
            const fullCartResponse = {
                ...updatedCart.toJSON(),
                totalCount,
                totalPrice
            };

            res.status(created ? 201 : 200).json(fullCartResponse);
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ 
                message: 'Server error when adding to cart', 
                error: error instanceof Error ? error.message : 'An unknown error occurred' 
            });
        }
    } else {
        res.status(400).json({ message: 'User ID and Product ID are required' });
    }
};


// Remove a product from the cart
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

// Clear the cart for a specific user
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

// Update the quantity of a product in the cart
export const updateQuantity: RequestHandler = async (req, res) => {
    let { quantity } = req.body;
    let { userId, productId } = req.params;

    if (userId && productId) {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json('Cart not found');
        }

        const updated = await CartProduct.update(
            { quantity },
            { where: { cartId: cart.cartId, productId } }
        );

        if (updated[0] > 0) {
            res.status(200).json('Quantity updated successfully');
        } else {
            res.status(404).json('Product not found in cart');
        }
    } else {
        res.status(400).send('User ID and Product ID are required');
    }
};