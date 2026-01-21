import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { dbConnect } from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4001;


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());



import authRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes)








dbConnect().then(()=>{
    app.get("/", (req, res)=>{
        return res.status(200).json({
            success: true,
            message: `Server is running up...`
        })
    })



    app.listen(PORT, ()=>{
        console.log(`Server is running on PORT ${PORT}`)
    })

})
.catch((err)=>{
    console.log("Error : ", err)
})