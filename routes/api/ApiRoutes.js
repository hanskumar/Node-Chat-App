
const router = require("express").Router();
const ApiController = require("../../controllers/ApiController");

//const checkAuth = require("../middleware/auth");


router.get("/GetUsers", ApiController.getAllUsers);




module.exports = router;