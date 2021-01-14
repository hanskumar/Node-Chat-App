require("dotenv").config();
const mongoose      = require('mongoose');

/*-----Connect to DB----------*/
module.exports = (req, res) => {

    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
    }).then(()=>{
        console.log('Mongo Database connected 🥳🥳🥳🥳');
    }).catch(err=>{
        console.log("Connection::"+ err);
    });
}
