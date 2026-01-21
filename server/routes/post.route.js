import { Router } from "express";
const router = Router();


import { createPost, deletePost, getAllOwnerPost, getAllPost, getPost, updatePost } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


// router.get("/", authMiddleware, getAllPost);
router.get("/", getAllPost);
router.get("/ownerPosts", authMiddleware, getAllOwnerPost);
// router.get("/:id", authMiddleware, getPost);
router.get("/:id", getPost);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);




export default router;