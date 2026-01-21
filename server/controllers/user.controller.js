import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"




export const register = async(req, res)=>{
    try{
        // get data from req.body
        const {fullName, username, email, password} = req.body;

        // validation
        if(!fullName || !username || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check user exist
        const existingUser  = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success: false,
                message: "User already register. Please Login into your account..."
            })
        }

        const user = new User({
            fullName, 
            username,
            email,
            password,
        })

        await user.save();

        const accessToken = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )


        // set cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
        })


        return res.status(200).json({
            success: true,
            message: "Account created successfully",
            data : {
                id: user._id,
                username: user.username,
                email: user.email, 
                accessToken,
            }
        })
    }
    catch(err){
        console.log("Error in Register : ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server Error",
        })
    }
}






export const login = async(req, res)=>{
    try{
 // get data from req.body
        const {email='', username='', password} = req.body;

        // validation
        if(!(email || username) || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check user exist
        const existingUser  = await User.findOne({
            $or: [
                {username},
                {email}
            ]
        });

        
        if(!existingUser){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        
        const isMatched = await existingUser.matchPassword(password);
        // console.log("isMatched : ", isMatched)
        if(!isMatched){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }


        const accessToken = jwt.sign(
            {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )


        // set cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
        })



        return res.status(200).json({
            success: true,
            message: "Login successfully",
            data : {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email, 
                accessToken,
            }
        })
    }
    catch(err){
        console.log("Error in Login : ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}