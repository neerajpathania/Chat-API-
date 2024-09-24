const UserRegister = require("../model/register");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const otpVerification = require('../verification/verification');
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'dmda8jeie',
    api_key: '577636815548136',
    api_secret: '5mnwvgpRV2QFHXi_niAufkwgSGg'
});

const uploadImageToCloudinary = async (filePath) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, (error, result) => {
            if (error) reject(error);
            console.log(error)
            resolve(result.url);
        });
    });
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525, // Keep this as a number
    secure: false, // Set to false since you're using a non-SSL connection
    auth: {
        user: "ca089139e7a956",
        pass: "2b00c2db97e280"
    }
});

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Step 1: Send OTP to email
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body)
        const user = await UserRegister.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        const verifyEmail = await otpVerification.findOne({ receiver: email })
        if (verifyEmail) {
            // If there's an existing entry, delete it
            await otpVerification.deleteOne({ receiver: email });
        }

        const otp = generateOTP();
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1); // OTP valid for 1 hour

        // Prepare OTP email
        const mailOptions = {
            to: email,
            from: "your-email@example.com", // Replace with your email address
            subject: "One Time Password (OTP)",
            text: `Your OTP is: ${otp}\nIt will expire in 1 hour.`
        };

        // Send OTP email
        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.error("Error sending OTP:", err);
                return res.status(500).json({ success: false, message: "Error sending OTP" });
            } else {
                console.log("OTP email sent:", info.response);

                // Save OTP in the database
                const verification = new otpVerification({
                    receiver: email,
                    otp: otp,
                    otpExpires: expirationTime,
                    timestamp: new Date()
                });
                await verification.save();

                res.status(200).json({ success: true, message: "OTP sent successfully to your email" });
            }
        });
    } catch (error) {
        console.error("Error in sendOtp:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Step 2: Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log(req.body)
        const otpVerify = await otpVerification.findOne({ otp });

        if (!otpVerify) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Step 3: Register User (after OTP verification)
const registerUser = async (req, res) => {
    try {
        const { firstname, lastname } = req.body;
        let profilePic = null
        if (req.file) {
            profilePic = await uploadImageToCloudinary(req.file.path);
        }

        const newUser = new UserRegister({
            profilePic: profilePic,
            firstname,
            lastname
        });
        const userRegistered = await newUser.save();

        if (userRegistered) {
            return res.status(200).json({
                success: true,
                message: "User registered successfully",
                data: userRegistered,
                token: generateToken(userRegistered._id)
            });
        }
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    registerUser,
};
