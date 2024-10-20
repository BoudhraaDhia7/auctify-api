import { AuctionsModel } from "../models/Auctions.js";
import { BetsModel } from "../models/Bets.js";
import { UserModel } from "../models/Users.js";
import { UpdateUserSolde } from "./Helpers.js";

export const JoinAuction = async (data) => {
  try {
    await AuctionsModel.findOneAndUpdate(
      {
        idUser: data.idUser,
        idProduct: data.idProduct,
      },
      { $set: { status: 1,  nickname: data.nickname, avatar: data.avatar, idSocket: data.idSocket } },
      { upsert: true }
    );
    return 1;
  } catch (error) {
    return error;
  }
};

export const unJoinAuction = async (socket) => {
  try {
    await AuctionsModel.findOneAndUpdate(
      {
        idSocket: socket,
      },
      { $set: { status: 0} },
    );
    return 1;
  } catch (error) {
    return error;
  }
};

export const MiseAndUpdateSolde = async (data) => {
  try {

    //check if user has enough money
    const user = await UserModel.findById(data.idUser);

    if(user.solde < data.amount){
      return "solde is not enough to participate";
    }
    
    const bet =  BetsModel({
      idUser: data.idUser,
      idProduct: data.idProduct,
      amount: data.amount,
      duration: data.duration,
    });

    await bet.save();

    await UpdateUserSolde(data.idUser, -data.amount);

    return 1;
    
  } catch (error) {
    return error;
  }
};
