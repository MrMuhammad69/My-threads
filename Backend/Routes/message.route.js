import express from 'express'
import {  getConversations, getMessages, SendMessage } from '../Controllers/message.controller.js'

const router = express.Router()

router.get('/conversations', getConversations)
router.post('/', SendMessage)
router.get('/:otherUserId', getMessages)


export default router