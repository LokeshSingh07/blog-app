import mongoose, { Schema } from "mongoose";


const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 120
    },
    content: {
        type: String,
        required: true,
        minLength: 50
    },
    imageUrl: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    }

}, {timestamps: true});





export const Post = mongoose.model("Post", postSchema)