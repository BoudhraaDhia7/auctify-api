import {WinnerModel} from "../models/Winners.js";
import {ProductModel} from "../models/Products.js";
import { BetsModel } from "../models/Bets.js";
import { AlertsModel } from "../models/Alerts.js";
import { UserModel } from "../models/Users.js";
import { io } from "../index.js";

export const winner = async (req, res, next) => {
    const { productId } = req.body;

    try {
        const lastBet = await BetsModel.findOne({ idProduct: productId })
        .sort({ created_at: -1 })
        .populate('idUser');
    
      if (!lastBet) {
        return res.status(404).json({ message: "No bets found for this product." });
      }
    
      const newWinner = new WinnerModel({
        product: productId,
        player: lastBet.idUser._id, 
      });
    
      const savedWinner = await newWinner.save();
    
    await ProductModel.updateOne(
        { _id: productId },
        { $set: { status : 3 } }
    );

    //get the player with find with lastBet.idUser._id
    const player = await UserModel.findById(lastBet.idUser._id); 

    const alertinfo = new AlertsModel({
        avatar: player.avatar,
        nickname: player.userName,
        content: `Félicitations ${player.userName} ! Vous avez remporté l'enchère pour le produit ${productId}.`,
        link: `/productinfo/${productId}`
    });

      const alertData = await alertinfo.save();

      io.emit("newNotification", alertData);
    setTimeout(() => {
      io.emit("newWinner", { playerId: player._id });
    }, 5000);
      
      res.status(200).json({ savedWinner });
    } catch (error) {
      res.status(400).json({ error });
    }
  };

export const winners = async(req,res,next)=>{
    try{
        const products = await WinnerModel.find();
        res.status(200).json(products);
    }catch(error)
    {
        res.status(400).json({error})
    }
}