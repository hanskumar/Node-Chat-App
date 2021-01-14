
const User          = require('../models/UserModel');

exports.getAllUsers =async (req, res) => {

    /*------Get all registered User from DB-----------------*/
    const users = await User.find({ _id: { $ne: req.user._id } });

    try{

        res.status(200).send(users);

    } catch(err){

        res.status(201).send(users);
    }
}