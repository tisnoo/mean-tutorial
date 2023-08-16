const express = require('express');
const bodyParser = require('body-parser');

const app = express();
 
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: "Post added sucesfully!",
    });
})

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {id: "1", title: "First server-side post", content: "This is coming from the server 1",},
        {id: "2", title: "Second server-side post", content: "This is coming from the server 2",},
        {id: "3", title: "Third server-side post", content: "This is coming from the server 3",},
    ];
    
    res.status(200).json({
        message: "Posts fetches succesfully!",
        posts: posts,
    });
});

module.exports = app;