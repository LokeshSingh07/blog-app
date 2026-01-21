import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        trim: true,
        index: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
        type: String,
        required: true
    },
    
}, {timestamps: true});



userSchema.pre("save", async function(){
    
    if(!this.isModified("password")) return ;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // console.log("→ Pre-save middleware running – next is:", typeof next);
        // next();
    }
    catch (err) {
        // next(err);
        return err; 
    }
})


userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}



export const User = mongoose.model("User", userSchema)