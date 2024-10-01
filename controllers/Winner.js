import {WinnerModel} from "../models/Winners.js";
import {ProductModel} from "../models/Products.js";

export const winner =async(req,res,next)=>{
    const {product,player}=req.body
try{
    const newWinner = new WinnerModel({
        product,
        player,
    });
    const savedWinner = await newWinner.save();
    res.status(200).json({savedWinner})

}catch(error)
{
    res.status(400).json({error})
}
}

export const winners = async(req,res,next)=>{
    try{
        const products = await WinnerModel.find();
        res.status(200).json(products);
    }catch(error)
    {
        res.status(400).json({error})
    }
}