const mongoose = require('mongoose')
const registerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true]
    },
    firstname: {
        type: String,
        required: [true]
    },
    lastname: {
        type: String,
        required: [true]
    },
    token: {
        type: String,
        required: [false, "Please add a username"],
    },
})

module.exports = mongoose.model("Register", registerSchema)