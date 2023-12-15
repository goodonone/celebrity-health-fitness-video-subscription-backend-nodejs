import { Product } from "../models/product";
import { RequestHandler } from "express";
import { verifyToken } from "../services/auth";
import {User} from "../models/user";


//Get All Product Items or All Product in cart
export const getAllProducts: RequestHandler = async (req, res, next) => {
    let products = await Product.findAll();
    res.status(200).json(products);

}

//Render Product Page
export const addProductPage: RequestHandler = (req, res, next) => {
    res.render('add-Product');
}

//Get A Product by productId
export const getProduct: RequestHandler = async (req, res, next) => {
    let productId = req.params.paymentId;
    let productFound = await Product.findByPk(productId);
    if (productFound) {
        res.status(200).json(productFound);
    }
    else {
        res.status(404).json();
    }
}

//Add product to cart
//Please double check updateProduct function
export const updateProduct: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyToken(req);

    if (!user){
        return res.status(403).send(); //403 forbidden if user is not logged in 
    }
    
    let productId = req.params.paymentId;
    let newProduct: Product = req.body;
    
    let productFound = await Product.findByPk(productId);
    
    if (productFound && productFound.productId == newProduct.productId
        && newProduct.paymentId ) {
            if (productFound.productId == user.userId ) 
            {    
                await Product.update(newProduct, {
                    where: { productId: productId }
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

//Delete Product Item
export const deleteProduct: RequestHandler = async (req, res, next) => {
    let productId = req.params.productId;
    let productFound = await Product.findByPk(productId);
    
    if (productFound) {
        await Product.destroy({
                where: { productId: productId }
        });
        res.status(200).json();
    }
    else {
        res.status(404).json();
    }
}

// export const createProduct: RequestHandler = async (req, res, next) => {
//     let user: User | null = await verifyToken(req);

//     if (!user){
//         return res.status(403).send(); //403 forbidden if user is not logged in 
//     }

//     let newProduct: Product = req.body;
//     newProduct.userId = user.userId;
//     if (newProduct.DateOfBirth) {
//         let created = await Product.create(newProduct);
//         res.status(201).json(created);
//     }
//     else {
//         res.status(400).send();
//     }
// }
