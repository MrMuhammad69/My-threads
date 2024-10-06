import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    // Use the correct cookie name: 'jwt-threads'
    const token = req.cookies['jwt-threads'];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verify the JWT using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user based on the decoded token (without the password field)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    // Attach the user to the request object
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in protectRoute: ", err.message);
  }
};

export default protectRoute;
