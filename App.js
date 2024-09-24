require('dotenv').config()
const express = require('express')
const cors = require('cors');
const path = require('path')
const http = require('http')
const app = express()
const multer = require("multer");
const registerRoutes = require("./routes/registerRoutes")

const connectDB = require('./db/conn');
const bodyParser = require('body-parser');

const server = http.createServer(app)
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use("/api/user", registerRoutes);

const DB_URL = process.env.DB_URL

const start = async () => {
    console.log("Starting ", DB_URL);
    try {
        await connectDB(DB_URL);
        server.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
};

start(process.env.DATABASE) 