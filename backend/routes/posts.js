const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const extractFile = require('../middleware/file');
const PostsController = require('../controllers/posts');

router.get('', PostsController.getPosts);
router.get('/:id', PostsController.getPost);
router.post('', checkAuth, extractFile, PostsController.createPost);
router.patch('/:id', checkAuth, extractFile, PostsController.updatePost);
router.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = router;