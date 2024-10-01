import { io } from "../index.js";
import { AlertsModel } from "../models/Alerts.js";
import { CompanyModel } from "../models/Companies.js";
import { TransactionModel } from "../models/Transactions.js";
import { UserModel } from "../models/Users.js";

export const CreateTransaction = async (
  profile,
  val,
  transactionIdentifier,
  transactionType,
  reciever = null
) => {
  const se = val < 0 ? profile : undefined;
  const re = reciever != null ? reciever : val > 0 ? profile : undefined;
  console.log(
    "create transaction",
    profile,
    val,
    transactionIdentifier,
    se,
    re
  );

  try {
    const newTransaction = new TransactionModel({
      transactionIdentifier: transactionIdentifier,
      amount: Math.abs(val),
      profile: profile,
      sender: se,
      receiver: re,
      realAmount: Math.abs(val),
      transactionType: transactionType,
    });
    await newTransaction.save();
  } catch (error) {
    return error;
  }
};

//updateprofilesolde

export const UpdateUserSolde = async (profile, val) => {
  const sended = val < 0 ? Math.abs(val) : 0;
  const recieved = val > 0 ? Math.abs(val) : 0;

  try {
    await UserModel.updateOne(
      { _id: profile },
      { $inc: { solde: val, amountRecieved: recieved, amountSent: sended } }
    );
  } catch (error) {
    return error;
  }
};

export const AddNewProdAlert = async (profile, link, prodname) => {
  
  try {
    const company = await CompanyModel.findById(profile);
    const alertinfo = new AlertsModel({
      avatar : company.logo,
      nickname : company.userName,
      content : "a ajouté un nouveau produit " + prodname,
      link : link
    });
    const alertData = await alertinfo.save();
    io.emit("newNotification", alertData);

  } catch (error) {
    return error;
  }
};

export const AddNewUserAlert = async (avatar, link, nickname) => {
  
  try {
    const alertinfo = new AlertsModel({
      avatar : avatar,
      nickname : nickname,
      content : "vient de s'inscrire a notre plateforme ",
      link : link
    });
    const alertData = await alertinfo.save();
    io.emit("newNotification", alertData);

  } catch (error) {
    return error;
  }
};
