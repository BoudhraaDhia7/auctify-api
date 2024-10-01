import {SettingModel} from "../models/Settings.js";
import CustomError from "../utils/CustomError.js";
import {UserSettingModel} from "../models/UserSettings.js";
import mongoose from "mongoose";
import {AuctionsModel} from "../models/Auctions.js";
import {CartPackModel} from "../models/CartPacks.js";
import jwt from "jsonwebtoken";

export const settings = async (req,res,next)=>{
    const {title,variable}=req.body
 try{
   const createNewSettings = new SettingModel({
        title,
        variable
    })
    await createNewSettings.save();
    return res.status(201).json({ message: "new setting successfully created " });
 }catch (error)
    {
     console.log(error.message);
     next(new CustomError(error.message, 500));
    }
}

export const userSettings = async (req,res,next)=>{
    const {idUser,variable,value}=req.body
    try{
        const user = await UserSettingModel.findOne({idUser});
        console.log(user)
        const createNewSettings = new UserSettingModel({
            idUser,
            variable,
            value
        })
        await createNewSettings.save();
        return res.status(201).json({ message: "new user setting successfully created " });
    }catch (error)
    {
        console.log(error.message);
        next(new CustomError(error.message, 500));
    }
}

export const getAllSettings = async (req,res,next)=>{

    try{
        const allSettings = await SettingModel.find();
        return res.status(201).json( allSettings );
    }catch (error)
    {
        console.log(error.message);
        next(new CustomError(error.message, 500));
    }
}

export const getUserSettings = async (req, res, next) => {
    try {
        const { id } = req.params;
        const myId = new mongoose.Types.ObjectId(id);
        const settings = await SettingModel.aggregate([
            {
                $lookup: {
                    from: "usersettings",
                    localField: "variable",
                    foreignField: "variable",
                    as: "matchedSettings"
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    variable: 1,
                    created_at: 1,
                    updatedAt: 1,
                    unit: 1,
                    __v: 1,
                    matchedSettings: {
                        $filter: {
                            input: "$matchedSettings",
                            as: "matched",
                            cond: { $or : [{$eq: ["$$matched.idUser", myId]}, {$eq: ["$$matched.defaultVal", true]}] }

                        }
                    }
                }
            }
        ]);

        res.json(settings);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const updateSettingValue = async (req, res, next) => {
    try {
        const ret = await UserSettingModel.findOneAndUpdate(
            {
                idUser: req.body.idUser,
                variable: req.body.variable
            },
            { $set: { value: req.body.value } },
            { upsert: true }
        );
        res.json(ret);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const createCartPacks =async (req,res,next)=>{
    const {title,soldeValue,realValue}=req.body;
    try{
        const createNewPack = new  CartPackModel({
            title,
            soldeValue,
            realValue
        })
        await createNewPack.save();
        return res.status(201).json({ message: "new pack successfully created " });
    }catch (error)
    {
        console.log(error.message);
        next(new CustomError(error.message, 500));
    }
}


export const getAllPacks = async (req,res,next)=>{

    try{
        const allPacks = await CartPackModel.find();
        return res.status(201).json( allPacks );
    }catch (error)
    {
        console.log(error.message);
        next(new CustomError(error.message, 500));
    }
}


export const updateSoldePack = async (req,res,next) => {
    const {packId, title, soldeValue, realValue}=req.body
    try {
        const updatedPack = await CartPackModel.findOneAndUpdate(
            { _id: packId },
            {
                title: title,
                soldeValue: soldeValue,
                realValue: realValue
            },
            { new: true }
        );



        return res.status(201).json({updatedPack  });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteSoldePack = async (req,res,next) => {

    const id = req.params;
    const packId = new mongoose.Types.ObjectId(id);
    try {

        await CartPackModel.findByIdAndDelete(packId);

        return res.status(200).json({ message: "Pack deleted successfully" });
    } catch (error) {
        console.log(error.message);
        next(new CustomError(error.message, 500));
    }
};
