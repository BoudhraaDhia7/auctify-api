import {WinnerModel} from "../models/Winners.js";
import {ProductModel} from "../models/Products.js";
import { AlertsModel } from "../models/Alerts.js";
import mongoose from "mongoose";


export const getnotifications = async(req,res,next)=>{
    try{
        const alerts = await AlertsModel.find({}).sort({ date : -1}).limit(10);
        res.status(200).json(alerts);
    }catch(error)
    {
        res.status(400).json({error})
    }
}

export const updateNotifStatus = async(req,res,next)=>{

    const {  alertId  } = req.body;
    const idAlert = new mongoose.Types.ObjectId(alertId);

    try{
        const alerts = await AlertsModel.updateOne(
            { _id: idAlert },
            { $set: { status : 1 } }
          );
        res.status(200).json(alerts);
    }catch(error)
    {
        res.status(400).json({error})
    }
}