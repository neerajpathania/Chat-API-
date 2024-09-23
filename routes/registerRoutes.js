const express = require('express')
const router = express.Router()

const {
    registerUser,
    verifyOtp,
    sendOtp,
} = require('../Controller/userController')

router.post("/registerUser", registerUser)
router.get("/verifyOtp", verifyOtp)
router.post("/sendOtp", sendOtp)

module.exports = router