const multer = require("multer");
const Post = require("../models/post");
const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const PostsController = require('../controllers/posts');


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

router.get('', PostsController.getPosts);
router.get('/:id', PostsController.getPost);
router.post('', checkAuth, multer({storage: storage}).single("image"), PostsController.createPost);
router.patch('/:id', checkAuth, multer({storage: storage}).single("image"), PostsController.updatePost);
router.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = router;