import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
dotenv.config()
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Check Cloudinary connection
const checkCloudinaryConnection = async () => {
    try {
        const result = await cloudinary.api.ping(); // Use the ping method to check connection
        console.log('Cloudinary connected successfully:', result);
    } catch (error) {
        console.error('Cloudinary connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Call the connection check function
checkCloudinaryConnection();
