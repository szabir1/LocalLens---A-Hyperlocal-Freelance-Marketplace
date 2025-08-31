import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).send(savedConversation);
  } catch (err) {
    next(err);
  }
};


export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.isSeller
          ? { readBySeller: true }
          : { readByBuyer: true },
      },
      { new: true }
    );
    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return next(createError(404, "Not found!"));
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};


export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};


export const createOrGetConversation = async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const buyerId = req.userId;

  try {
    let conversation = await Conversation.findOne({
      $or: [
        { sellerId, buyerId },
        { sellerId: buyerId, buyerId: sellerId }, // edge case
      ],
    });

    if (!conversation) {
      conversation = new Conversation({
        sellerId,
        buyerId,
        readBySeller: false,
        readByBuyer: true,
      });
      conversation = await conversation.save();
    }

    res.status(200).send({ id: conversation._id, ...conversation._doc }); // send full object including _id
  } catch (err) {
    next(err);
  }
};
