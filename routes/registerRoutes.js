const express = require('express')
const router = express.Router()
const multer = require("multer");

const storage = multer.diskStorage({});

const upload = multer({ storage });

const {
    registerUser,
    verifyOtp,
    sendOtp,
} = require('../Controller/userController')

router.post("/registerUser", upload.single("profilePic"), registerUser)
router.post("/verifyOtp", verifyOtp)
router.post("/sendOtp", sendOtp)

module.exports = router