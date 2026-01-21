import { Post } from "../models/post.model.js"




// posts?search=&page=&limit=
export const getAllPost = async(req, res)=>{
    try{
        const {search='', page, limit} = req.query;

        const query = {
            $or: [
                {title: {$regex: search.trim(), $options: 'i'}},
                {username: {$regex: search.trim(), $options: 'i'}},
            ]
        } 

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        const posts =  await Post.find(query)
            .sort({createdAt: -1})
            .skip((pageNum-1)*limitNum)
            .limit(parseInt(limitNum))
            .lean();



        const total = await Post.countDocuments(query);
        

        return res.status(200).json({
            success: true,
            message: "All posts fetched",
            data: posts,
            total: total 
        })
    }
    catch(err){
        console.log("Error in getAllPosts : ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}



// posts:/id
export const getPost = async(req, res)=>{
    try{
        const postId = req.params.id;

        const post = await Post.findById(postId).lean();

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }


        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post
        })
    }
    catch(err){
        console.log("Error in fetching post : ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}




// create
export const createPost = async(req, res)=>{
    try{
        const {title, content, imageUrl} = req.body;

        if(!title || !content){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const post = await Post.create({
            title: title.trim(),
            content: content.trim(),
            imageUrl,
            username: req.user.username,
        })


        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post
        })
    }
    catch(err){
        console.log("Error in createPost : ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}





// posts/:id
export const updatePost = async(req, res)=>{
    try{
        const postId = req.params.id;
        const {title, content, imageUrl} = req.body;

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if(post.username !== req.user.username){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this post",
            })
        }

        if (title !== undefined) post.title = title.trim();
        if (content !== undefined) post.content = content.trim();
        if (imageUrl !== undefined) post.imageUrl = imageUrl.trim();


        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: post
        })
    }
    catch(err){
        console.log("Error in updatePost : ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}



// posts/:id
export const deletePost = async(req, res)=>{
    try{
        const postId = req.params.id;
        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if(post.username !== req.user.username){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post",
            })
        }

        await post.deleteOne();


        return res.status(200).json({
            success: true,
            message: "Post deleted",
        })
    }
    catch(err){
        console.log("Error in deletePost : ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}



export const getAllOwnerPost = async (req, res) => {
    try {
        const username = req.user.username; 

        if (!username) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - user not found in request'
            });
        }

        const posts = await Post.find({ username })
        .sort({ createdAt: -1 })
        .lean();


        return res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });

    }
    catch(err){
        console.error('Error in getAllOwnerPost:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching your posts',
        });
    }
};