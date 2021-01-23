
const router = require("express").Router();

const checkAuth = require("../middleware/auth");
const UserController = require("../controllers/UserController");
const MessageController = require("../controllers/MessageController");

const multerupload = require("../config/upload_profile_image");

const MediaAttachment = require("../config/media_attachment");

const multer  = require('multer') //use multer to upload blob data
const upload = multer();

/**
 * Define all Routes here
 */
router.get("/", UserController.index);

router.get("/register", UserController.register);

router.post("/register", UserController.registerpost);

router.post("/login", UserController.login);

router.get("/dashboard", checkAuth,UserController.dashboard);

router.get("/logout",checkAuth,UserController.logout);

router.post("/upload_profileImage",checkAuth,multerupload.upload,UserController.upload_profileImage);

router.get("/uploads/:path", UserController.GetImagePath); 


router.get("/chat/:chatId",checkAuth, MessageController.InitiateChat); 

router.post("/message/send",checkAuth, MessageController.SaveMessage); 

router.post("/media_attachment",checkAuth, MediaAttachment.media_attachment,MessageController.UploadMedia); 

router.post("/save/audio",checkAuth,MessageController.SaveAudio); 


router.get("/audio",checkAuth,MessageController.getAudio); 


module.exports = router;