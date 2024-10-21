
import mongoose from 'mongoose';

import { User } from '../models/user.model.js';
import Transaction from '../models/transactionModel.js';
import { sendEmailNotification } from "../utils/emailService.js";




 const MAX_RETRIES = 3; 
export const transfer = async (req, res) => {
  const { sender, receiver, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: "Transfer amount must be positive" });
  }

  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    const session = await mongoose.startSession();
    session.startTransaction(); // Begin the transaction

    try {
      const senderAccount = await User.findById(sender).session(session);
      const receiverAccount = await User.findById(receiver).session(session);

      if (!senderAccount || !receiverAccount) {
        return res.status(404).json({ message: "Account not found" });
      }

      if (senderAccount.balance < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Update account balances
      senderAccount.balance -= amount;
      receiverAccount.balance += amount;

      await senderAccount.save({ session });
      await receiverAccount.save({ session });

      // Create a transaction record
      const transaction = new Transaction({
        sender: senderAccount._id,
        receiver: receiverAccount._id,
        amount,
        type: "transfer",
        reference: `TX-${Date.now()}`,
        status: "completed",
      });

      await transaction.save({ session });

      await session.commitTransaction(); // Commit the transaction
      session.endSession();

      // Send email notifications to both parties
      await sendEmailNotification(senderAccount, receiverAccount, amount);

      return res.status(200).json({
        message: 'Transfer successful',
        success: true,
      });

    } catch (error) {
      await session.abortTransaction(); // Rollback on error
      session.endSession();

      if (error.codeName === "WriteConflict" && retryCount < MAX_RETRIES) {
        console.warn("Write conflict detected, retrying transaction...");
        retryCount++;
        continue; // Retry the transaction
      }

      console.error("Error during transfer:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(500).json({ message: "Failed to complete transfer after retries" });
};



// get all transactions by user
export const getAllTransactions = async (req, res) => {
  try {
  
     //const transactions = await Transaction.find({ $or: [{sender: req.body.userId}, {receiver: req.body.userId}] })
      const transactions = await Transaction.find({ $or: [{sender: req.body.userId}, {receiver: req.body.userId}] }).
     sort({createdAt: -1}).populate("sender").populate("receiver");
    

    res.status(200).json({
      success: true,
      data: transactions,
      token: req.token,
    });
  } catch (error) {
    console.error("Error in CheckAuth:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}






export const verifyAccount = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.body.receiver})

    if (user) {
      return res.status(200).json({
        message: 'Account verified successfully',
        success: true,
        data: user,
      });
    } else {
      return res.status(404).json({
        message: 'Account not found',
        success: false,
      });
    }
    
  } catch (error) {
    
  }

};

