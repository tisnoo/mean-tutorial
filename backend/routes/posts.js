const express = require("express");
const Post = require("../models/post");
const router = express.Router();

router.post('', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added sucesfully!",
            postId: createdPost._id,
        });
    });
})

router.patch('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
    });

    Post.updateOne({_id: req.params.id}, post).then(createdPost => {
        res.status(200).json({
            message: "Post updated sucesfully!",
            postId: createdPost._id,
        });
    });
})


router.get('', (req, res, next) => {
    Post.find().then(documents => { 
        res.status(200).json({
            message: "Posts fetches succesfully!",
            posts: documents,
        });
    });
});


router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => { 
        if (post){
            res.status(200).json(post);
        }else{
            res.status(404).json({
                message: "Post not found!",
                post: post,
            });
        }
    });
});

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: "Post deleted sucesfully!",
        });
    });
});

module.exports = router;