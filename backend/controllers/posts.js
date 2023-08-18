const multer = require("multer");
const Post = require("../models/post");

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid){
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId,
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added sucesfully!",
            post: {
                id: createdPost._id,
                ...createdPost,
            }
        });
    });
};

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/images/' + req.file.filename;
    }


    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId,
    });

    Post.updateOne({_id: req.params.id, creator: req.userData.userId, }, post).then(result => {
        if (result.modifiedCount > 0){
            res.status(200).json({
                message: "Post updated sucesfully!",
                postId: result._id,
            });
        }else{
            res.status(401).json({
                message: "Not authorized!",
            });
        }
    });
}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    if (pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    postQuery.then(documents => { 
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: "Posts fetches succesfully!",
            posts: fetchedPosts,
            maxPosts: count,
        });
    });
}

exports.getPost = (req, res, next) => {
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
}


exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if (result.deletedCount > 0){
            res.status(200).json({
                message: "Post deleted sucesfully!",
            });
        }else{
            res.status(401).json({
                message: "Not authorized!",
            });
        }
    });
}