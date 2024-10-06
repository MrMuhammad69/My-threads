import express from "express";
import {signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getProfile} from '../Controllers/users.controller.js'
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router()
router.get('/profile/:username', getProfile)
router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id',protectRoute, followUnfollowUser)
router.put('/update/:id',protectRoute, updateUser)

export default router