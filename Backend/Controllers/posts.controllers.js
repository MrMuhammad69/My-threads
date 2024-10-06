import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export async function createPost(req, res) {
    try {
        const { postedBy, text, img } = req.body;

        // Check if required fields are present
        if (!postedBy || !text) {
            return res.status(400).json({ error: "Please fill in all fields." });
        }

        // Find the user by ID
        const user = await User.findOne({ _id: postedBy });  // Corrected: passed an object with _id as the filter

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is the one making the request
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You can only post as yourself and not for others." });
        }

        // Ensure the text length does not exceed the maximum allowed
        const maxLength = 1500;
        if (text.length > maxLength) {  // Corrected typo from "lenght" to "length"
            return res.status(400).json({ message: `Text must be less than ${maxLength} characters` });
        }

        // Create and save the new post
        const newPost = new Post({
            postedBy,
            text,
            img
        });

        await newPost.save();

        return res.status(201).json({ message: "Post created successfully", newPost });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}
export async function getPost(req, res) {
    try {
        // Use the Post model to find the post by ID
        const post = await Post.findById(req.params.id);
        
        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Respond with the found post
        res.status(200).json({ post });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const replyToPost = async (req,res) => {
    try {
        const {text} = req.body
        const postId = req.params.id
        const userId = req.user._id
        const userProfilePic = req.user.userProfilePic
        const username = req.user.username
        if(!text){
            return res.status(400).json({error: "Please enter a reply text."})
        }
        const post = await Post.findById(postId)
        if(!post){
            res.status(404).json({message: "The post is not found"})
        }
        const reply = {userId, text,  userProfilePic, username}
        post.replies.push(reply)
        await post.save()
        res.status(200).json({message: "Reply added successfully", post})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
}
export async function getFeed(req, res) {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        const following = user.following;
        const posts = await Post.find({postedBy:{$in:following}}).sort({createdAt: -1})
        return res.status(200).json({feedPosts: posts})
    } catch (error) {
        res.status(500).json({message: error.message},)
    }
    
}