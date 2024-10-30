import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from './Routes/user.route.js'
import postRoutes from './Routes/post.route.js'
import protectRoute from "./middleware/protectRoute.js";
import messageRoutes from "./Routes/message.route.js";
dotenv.config();
connectDB()


const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(express.json())

  
app.use('/api/users', userRoutes)
app.use('/api/posts',protectRoute, postRoutes)
app.use('/api/messages',protectRoute, messageRoutes)


app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
