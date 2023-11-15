import { RequestHandler } from "express";
import {User} from "../models/user";
import { hashPassword, comparePasswords, signUserToken, verifyToken } from "../services/auth";

export const getAllUsers: RequestHandler = async (req, res, next) => {
    let users = await User.findAll();
    res.status(200).json(users);
}

export const getUser: RequestHandler = async (req, res, next) => {
    let userId = req.params.id;
    let user = await User.findByPk(userId);

    // let user: User | null = await verifyToken(req);
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({});
    }
}

export const createUser: RequestHandler = async (req, res, next) => {
    let newUser: User = req.body;
    if (newUser.username && newUser.password) {
        let hashedPassword = await hashPassword(newUser.password);
        newUser.password = hashedPassword;
        let created = await User.create(newUser);
        res.status(200).json({
            username: created.username,
            userId: created.userId
        });
    }
    else {
        res.status(400).send('Username and password required');
    }
}

export const loginUser: RequestHandler = async (req, res, next) => {
    // Look up user by their username
    let existingUser: User | null = await User.findOne({ 
        where: { username: req.body.username }
    });

    // If user exists, check that password matches
    if (existingUser) {
        let passwordsMatch = await comparePasswords(req.body.password, existingUser.password);
        // If passwords match, create a JWT
        if (passwordsMatch) {
            let token = await signUserToken(existingUser);
            res.status(200).json({ "username": existingUser.username,"userId":existingUser.userId, token });
        }
        else {
            res.status(401).json('Invalid password');
        }
    }
    else {
        res.status(401).json('Invalid username');
    }
}
