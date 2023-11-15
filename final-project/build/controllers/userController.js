"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = exports.getUser = exports.getAllUsers = void 0;
const user_1 = require("../models/user");
const auth_1 = require("../services/auth");
const getAllUsers = async (req, res, next) => {
    let users = await user_1.User.findAll();
    res.status(200).json(users);
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res, next) => {
    let userId = req.params.id;
    let user = await user_1.User.findByPk(userId);
    // let user: User | null = await verifyToken(req);
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({});
    }
};
exports.getUser = getUser;
const createUser = async (req, res, next) => {
    let newUser = req.body;
    if (newUser.username && newUser.password) {
        let hashedPassword = await (0, auth_1.hashPassword)(newUser.password);
        newUser.password = hashedPassword;
        let created = await user_1.User.create(newUser);
        res.status(200).json({
            username: created.username,
            userId: created.userId
        });
    }
    else {
        res.status(400).send('Username and password required');
    }
};
exports.createUser = createUser;
const loginUser = async (req, res, next) => {
    // Look up user by their username
    let existingUser = await user_1.User.findOne({
        where: { username: req.body.username }
    });
    // If user exists, check that password matches
    if (existingUser) {
        let passwordsMatch = await (0, auth_1.comparePasswords)(req.body.password, existingUser.password);
        // If passwords match, create a JWT
        if (passwordsMatch) {
            let token = await (0, auth_1.signUserToken)(existingUser);
            res.status(200).json({ "username": existingUser.username, "userId": existingUser.userId, token });
        }
        else {
            res.status(401).json('Invalid password');
        }
    }
    else {
        res.status(401).json('Invalid username');
    }
};
exports.loginUser = loginUser;
