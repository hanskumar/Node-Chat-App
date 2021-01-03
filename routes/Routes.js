
const router = require("express").Router();
const UserController = require("../controllers/UserController");
const checkAuth = require("../middleware/auth");


router.get("/", UserController.index);

router.get("/register", UserController.register);

router.post("/register", UserController.registerpost);

router.post("/login", UserController.login);

router.get("/dashboard", checkAuth,UserController.dashboard);

router.get("/logout",checkAuth,UserController.logout);



module.exports = router;