const mongoose = require('mongoose')
const registerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true]
    },
    lastname: {
        type: String,
        required: [true]
    },
    profilePic: {
        type: String
    },
    token: {
        type: String,
        required: [false, "Please add a username"],
    },
})

module.exports = mongoose.model("Register", registerSchema)