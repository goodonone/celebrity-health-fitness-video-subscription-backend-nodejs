"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateProfile = exports.createProfile = exports.getProfile = exports.getAllProfiles = void 0;
const profile_1 = require("../models/profile");
const getAllProfiles = async (req, res, next) => {
    let profiles = await profile_1.Profile.findAll();
    res.status(200).json(profiles);
};
exports.getAllProfiles = getAllProfiles;
const getProfile = async (req, res, next) => {
    let profileId = req.params.profileId;
    let profileFound = await profile_1.Profile.findByPk(profileId);
    if (profileFound) {
        res.status(200).json(profileFound);
    }
    else {
        res.status(404).json();
    }
};
exports.getProfile = getProfile;
const createProfile = async (req, res, next) => {
    let newProfile = req.body;
    if (newProfile.DateOfBirth) {
        let created = await profile_1.Profile.create(newProfile);
        res.status(201).json(created);
    }
    else {
        res.status(400).send();
    }
};
exports.createProfile = createProfile;
const updateProfile = async (req, res, next) => {
    let profileId = req.params.profileId;
    let newProfile = req.body;
    let profileFound = await profile_1.Profile.findByPk(profileId);
    if (profileFound && profileFound.profileId == newProfile.profileId
        && newProfile.DateOfBirth) {
        await profile_1.Profile.update(newProfile, {
            where: { profileId: profileId }
        });
        res.status(200).json();
    }
    else {
        res.status(400).json();
    }
};
exports.updateProfile = updateProfile;
const deleteProfile = async (req, res, next) => {
    let profileId = req.params.profileId;
    let profileFound = await profile_1.Profile.findByPk(profileId);
    if (profileFound) {
        await profile_1.Profile.destroy({
            where: { profileId: profileId }
        });
        res.status(200).json();
    }
    else {
        res.status(404).json();
    }
};
exports.deleteProfile = deleteProfile;
