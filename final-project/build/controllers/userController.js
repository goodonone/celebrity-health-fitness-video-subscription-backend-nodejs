"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.loginUser = exports.createUser = void 0;
const user_1 = require("../models/user");
const auth_1 = require("../services/auth");
const createUser = async (req, res, next) => {
    let newUser = req.body;
    console.log(newUser);
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
const getAllUsers = async (req, res, next) => {
    let users = await user_1.User.findAll();
    res.status(200).json(users);
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res, next) => {
    let user = await (0, auth_1.verifyToken)(req);
    if (!user) {
        return res.status(403).send(); //403 forbidden if user is not logged in 
    }
    let userId = req.params.id;
    let userFound = await user_1.User.findByPk(userId);
    // console.log(user)
    // console.log(userId)
    // let user: User | null = await verifyToken(req);
    if (userFound && userFound.userId == user.userId) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({});
    }
};
exports.getUser = getUser;
const updateUser = async (req, res, next) => {
    let user = await (0, auth_1.verifyToken)(req);
    // console.log(user)
    if (!user) {
        return res.status(403).send(); //403 forbidden if user is not logged in 
    }
    let userId = req.params.id;
    let newProfile = req.body;
    console.log(userId);
    console.log(newProfile);
    let userFound = await user_1.User.findByPk(userId);
    if (userFound && userFound.userId == newProfile.userId
        && newProfile.firstName) {
        if (userFound.userId == user.userId) {
            await user_1.User.update(newProfile, {
                where: { userId: userId }
            });
            res.status(200).json();
        }
        else {
            res.status(403).send();
        }
    }
    else {
        res.status(400).json();
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    let user = await (0, auth_1.verifyToken)(req);
    if (!user) {
        return res.status(403).send(); //403 forbidden if user is not logged in 
    }
    let userId = req.params.id;
    let userFound = await user_1.User.findByPk(userId);
    if (userFound) {
        if (userFound.userId == user.userId) {
            await user_1.User.destroy({
                where: { userId: userId }
            });
            res.status(200).json();
        }
        else {
            res.status(403).send();
        }
    }
    else {
        res.status(404).json();
    }
};
exports.deleteUser = deleteUser;
