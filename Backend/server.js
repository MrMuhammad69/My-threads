import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from './Routes/user.route.js'
import postRoutes from './Routes/post.route.js'
import protectRoute from "./middleware/protectRoute.js";
import messageRoutes from "./Routes/message.route.js";
import {app, server} from "./Socket/socket.js"
import path from "path";
dotenv.config();
connectDB()
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(express.json())

  
app.use('/api/users', userRoutes)
app.use('/api/posts',protectRoute, postRoutes)
app.use('/api/messages',protectRoute, messageRoutes)


// http://localhost:5000 -> Backend,Frontend
 

// React App
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
