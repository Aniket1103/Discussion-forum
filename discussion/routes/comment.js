import express from "express";
import { 
    createComment,
    deleteComment,
    getComments,
    updateComment,
  
 } from "../controllers/comment.js"
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post('/create',isAuthenticated, createComment);
router.patch('/update', isAuthenticated, updateComment);
router.delete('/delete/:commentId',isAuthenticated, deleteComment);
router.get('/getAll', isAuthenticated, getComments);

export default router;