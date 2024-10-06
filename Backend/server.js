import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from './Routes/user.route.js'
import postRoutes from './Routes/post.route.js'
import protectRoute from "./middleware/protectRoute.js";
import {v2 as cloudinary} from 'cloudinary'
import bodyParser from "body-parser";
dotenv.config();
connectDB()


const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(bodyParser.json({ limit: '10mb' }))


app.use('/api/users', userRoutes)
app.use('/api/posts',protectRoute, postRoutes)


app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
