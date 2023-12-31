const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://tnotkamp:" + process.env.MONGO_ATLAS_PW +"@cluster0.s3grz2g.mongodb.net/node-angular").then(() => {
    console.log("Connected to database");
}).catch(() => {
    console.log("Error connecting to database");
});
 
app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;