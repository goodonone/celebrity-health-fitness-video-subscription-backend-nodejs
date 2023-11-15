import { RequestHandler } from "express";
import { Profile } from "../models/profile";

export const getAllProfiles: RequestHandler = async (req, res, next) => {
    let profiles = await Profile.findAll();
    res.status(200).json(profiles);
}

export const getProfile: RequestHandler = async (req, res, next) => {
    let profileId = req.params.profileId;
    let profileFound = await Profile.findByPk(profileId);
    if (profileFound) {
        res.status(200).json(profileFound);
    }
    else {
        res.status(404).json();
    }
}

export const createProfile: RequestHandler = async (req, res, next) => {
    let newProfile: Profile = req.body;
    if (newProfile.DateOfBirth) {
        let created = await Profile.create(newProfile);
        res.status(201).json(created);
    }
    else {
        res.status(400).send();
    }
}


export const updateProfile: RequestHandler = async (req, res, next) => {
    let profileId = req.params.profileId;
    let newProfile: Profile = req.body;
    
    let profileFound = await Profile.findByPk(profileId);
    
    if (profileFound && profileFound.profileId == newProfile.profileId
        && newProfile.DateOfBirth ) {
            await Profile.update(newProfile, {
                where: { profileId: profileId }
            });
            res.status(200).json();
    }
    else {
        res.status(400).json();
    }
}

export const deleteProfile: RequestHandler = async (req, res, next) => {
    let profileId = req.params.profileId;
    let profileFound = await Profile.findByPk(profileId);
    
    if (profileFound) {
        await Profile.destroy({
                where: { profileId: profileId }
        });
        res.status(200).json();
    }
    else {
        res.status(404).json();
    }
}