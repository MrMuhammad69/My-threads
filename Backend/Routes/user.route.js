import express from "express";
import {signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getProfile, getSuggestedUsers, freezeAccount} from '../Controllers/users.controller.js'
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router()
router.get('/profile/:query', getProfile)
router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id',protectRoute, followUnfollowUser)
router.put('/update/:id',protectRoute, updateUser)
router.get('/suggested',protectRoute, getSuggestedUsers)

router.put('/freeze',protectRoute, freezeAccount)

export default router