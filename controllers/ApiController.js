const mongoose = require('mongoose');
const User          = require('../models/UserModel');  
const Chat          = require('../models/ChatModel');  


exports.getAllUsers =async (req, res) => {

    /*------Get all registered User from DB-----------------*/
    const users = await User.find({ _id: { $ne: req.user._id } });

    try{

        res.status(200).send(users);

    } catch(err){

        res.status(201).send(users);
    }
}

/**
 *  Create a chat with selected users
*/
exports.CreateChat = async (req, res) => {

    var selectedUsers = [];
    
     if(!req.body.user){
         console.log('fields requirred');
         res.sendStatus(400);
     }

    selectedUsers.push(req.body.user);
    selectedUsers.push(req.user._id); 
    
    let postData = {
        isGroupChat:false,
        users : selectedUsers
    }

    Chat.findOneAndUpdate({
        isGroupChat: false,
        users: {
            $size: 2,
            $all: [
                { $elemMatch: { $eq: mongoose.Types.ObjectId(req.user._id) }},
                { $elemMatch: { $eq: mongoose.Types.ObjectId(req.body.user) }}
            ]
        }
    },
    {
        $setOnInsert: {
            users: [req.user._id, req.body.user]
        }
    },
    {
        new: true,
        upsert: true
    })
    .then(async chatdata => {
        res.status(200).send(chatdata);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    /* Chat.create(postData)
     .then(async chatdata => {
         res.status(200).send(chatdata);
     })
     .catch(error => {
         console.log(error);
         res.sendStatus(400);
     }) */
}