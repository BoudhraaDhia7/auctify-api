import { TransactionModel } from "../models/Transactions.js";
import { UserModel } from "../models/Users.js";
import { v4 as uuidv4 } from "uuid";
import { CreateTransaction } from "../utils/Helpers.js";

export const transaction = async (req, res, next) => {
  let transactionIdentifier = uuidv4();
  const { soldeToSend, envoi, reception } = req.body;
  try {
    const sender = await UserModel.findById(envoi);
    const reciver = await UserModel.findById(reception);

    if (!sender || !reciver) {
      return res.json({ message: "sender and receiver are required" });
    }

    if (sender.solde < soldeToSend) {
      res
        .status(400)
        .json({ message: "solde is not enough to proceed this transaction" });
    }

    const profile = sender._id;

    await sender.updateOne({
      $push: { transcations: transactionIdentifier },
      $set: {
        solde: sender.solde - soldeToSend,
        amountSent: sender.amountSent + soldeToSend,
      },
    });

    await reciver.updateOne({
      $push: { transcations: transactionIdentifier },
      $set: {
        solde: reciver.solde + soldeToSend,
        amountRecieved: reciver.amountRecieved + soldeToSend,
      },
    });

    await CreateTransaction(
      profile,
      soldeToSend,
      transactionIdentifier,
      reciver._id
    );

    return res.status(200).json({
      message: "transaction created successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await TransactionModel.find().populate([
      "receiver",
      "sender",
    ]);

    res.status(200).send(transactions);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
