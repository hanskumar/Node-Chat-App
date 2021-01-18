/**
 * Load models Here
 */
const User         = require('../models/UserModel');
const Chat         = require('../models/ChatModel');
const Message      = require('../models/MessageModel');


const mongoose = require("mongoose");
//const path     = require('path');
//var helper     = require('../helpers/helper');

const fs     = require('fs');


exports.Getmessages = async (req, res) => {

    /*-------------Get all the Chats Here-----------*/
    var allChats = await Chat.find({users: { $elemMatch: { $eq: req.session.user._id } } })
    .populate("users");

    let payload = {
        title:'Messages',
        data:allChats,
        helper:helper
    }

    //res.send(allChats);

    res.status(200).render('messages',payload);
}


exports.NewMessage = async (req, res) => {
    res.render('new_message', { title: 'Not Found Page' });
}

exports.UserSearch = async (req, res) => {

    //console.log(req.query.search);
    /*------Get User By search key------*/

    if(req.query.search){

        var searchQuery={};
        //searchQuery.first_name = req.query.email;
        searchQuery.first_name = {$regex: req.query.search, $options: 'i'};     

        let result = await User.find(searchQuery) //like 'pa%'  {'name': {'$regex': 'sometext'}}

        res.send(result);
    }
}


exports.InitiateChat = async (req, res,next) => {

    //console.log(req.params.chatId);
    let chatID = req.params.chatId;
    
    /*-----------Check wther chatId is valid mongo Object ID/ and check from db also-----*/
    let IsValid = mongoose.isValidObjectId(chatID);
    if(!IsValid){
        res.render('404', { title: 'Something went wrong,Please try again' });
    }

    var chat = await Chat.findOne({ _id: chatID, users: { $elemMatch: { $eq: req.user._id } } })
    .populate({
        path: 'users',
        //match: { '_id': { $eq: '6001dd4d139db14edc1df3cf' }},
        match: { _id: { $ne: req.user._id }},
      }).exec();

    if(chat){

        var message = await Message.find({ chat: chatID}).populate("sender");
        var payload = {
            title:'Chat Page',
            data:chat,
            message:message
        }
        //res.status(200).send(payload);
        res.render('pages/chat', payload);
    } else {
        res.status(400).render('404', { title: 'Something went wrong,Please try again' });
    }
}

/**
 * Save Message in db
*/
exports.SaveMessage = async (req, res,next) => {

    const {message,ChatID} = req.body;

    if(!message || !ChatID){
        res.status(400).send('Fields are empty');
    }
    console.log(req.user._id);
    
    /*-----------Check wther chatId is valid mongo Object ID/ and check from db also-----*/

    /* let IsValid = mongoose.isValidObjectId(ChatID);
    console.log(IsValid);

    if(!IsValid){
        res.send('404', { message: 'ChatID Something went wrong,Please try again' });
    } */

    var chat = await Chat.findOne({ _id: ChatID, users: { $elemMatch: { $eq: req.user._id } } });

    if(chat){

        let postData = {
            readby:[],
            sender: req.user._id,
            //receiver: chat.users._id,
            message: message,
            chat:ChatID
        }

        Message.create(postData)
        .then(async newMessageData => {
            newMessageData = await User.populate(postData, { path: "sender" })

            res.status(201).send(newMessageData);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })

    } else {
        res.status(400).render('404', { title: 'Something went wrong,Please try again' });
    }
}

/**
 * Upload media file on server in chat stream
 */
exports.UploadMedia = async (req, res,next) => {

    console.log(req.body.ChatID);

    return;
    if(!req.file || !req.ChatID){
        res.status(400).json({status:false,message:'File is Required'});
    }

    var file_path = `/uploads/${req.file.filename}`;

    var chat = await Chat.findOne({ _id: ChatID, users: { $elemMatch: { $eq: req.user._id } } });

    if(chat){

        let postData = {
            readby:[],
            sender: req.user._id,
            message: '',
            media: file_path,
            chat:ChatID
        }

        Message.create(postData)
        .then(async newMessageData => {
            newMessageData = await User.populate(postData, { path: "sender" })

            res.status(201).send(newMessageData);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })

    } else {
        res.status(400).render('404', { title: 'Something went wrong,Please try again' });
    }

    //res.status(200).send(req.user);
    res.sendStatus(204);  // Success but given no content
} 