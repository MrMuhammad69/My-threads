import Conversation from "../models/conversationModel.js";
import Message from "../models/MessageModel.js";
import { getRecipientSocketId, io } from "../Socket/socket.js";
import {v2 as cloudinary} from "cloudinary"
export async function SendMessage(req, res) {
    try {
        const { recipientId, message, img } = req.body;
        const senderId = req.user?._id;

        // Check if all required data is provided
        if (!senderId) {
            return res.status(400).json({ error: "Sender ID is missing." });
        }
        if (!recipientId) {
            return res.status(400).json({ error: "Recipient ID is required." });
        }
        // Modified check: Allow either message or image
        if (!message && !img) {
            return res.status(400).json({ error: "Message content or image is required." });
        }

        // Find existing conversation or create a new one
        let conversation = await Conversation.findOne({ participants: { $all: [recipientId, senderId] } });

        if (!conversation) {
            conversation = new Conversation({
                participants: [recipientId, senderId],
                lastMessage: {
                    text: message || "Sent an image", // Default text for image-only messages
                    sender: senderId,
                    seen: false
                }
            });
            await conversation.save();
        }

        let uploadedImageUrl = null;
        if (img) {
            const uploadedImage = await cloudinary.uploader.upload(img);
            uploadedImageUrl = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message || "Sent an image", // Default text for image-only messages
            img: uploadedImageUrl
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({ lastMessage: { text: message || "Sent an image", sender: senderId, seen: false } })
        ]);
        const recipientSocketId = getRecipientSocketId(recipientId)
        if(recipientSocketId){
            io.to(recipientSocketId).emit('newMessage', newMessage)
        }

        // Log the message after it has been saved
        console.log("New message sent:", newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error); // Logging error to the console
        res.status(500).json({ error: error.message });
    }
}

export async function getMessages(req, res) {
    const { otherUserId } = req.params;
    const userId = req.user._id
    try {
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] } 
        })
        if(!conversation){
            return res.status(404).json({ error: "Conversation not found." });
        }
        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getConversations(req, res) {
	const userId = req.user._id;
	try {
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		// remove the current user from the participants array
		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter(
				(participant) => participant._id.toString() !== userId.toString()
			);
		});
		res.status(200).json(conversations);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}



