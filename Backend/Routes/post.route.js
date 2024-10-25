import express from "express";
import { createPost, getPost, deletePost,likeUnlikePost, replyToPost, getFeed, getUserPosts } from "../Controllers/posts.controllers.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router()

router.get('/feed',protectRoute, getFeed)
router.get('/:id', getPost)
router.post('/create',protectRoute, createPost)
router.delete('/:id',protectRoute, deletePost)
router.put('/like/:id',protectRoute, likeUnlikePost)
router.put('/reply/:id',protectRoute, replyToPost)
router.get('/user/:username', getUserPosts)

export default router