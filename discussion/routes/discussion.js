import express from "express";
import { 
  createDiscussion,
  deleteDiscussion,
 getDiscussions,
 incrementViewCount,
 updateDiscussion
 } from "../controllers/discussion.js"
import { isAuthenticated } from "../middleware/auth.js";
import { likeItem } from "../controllers/comment.js";

const router = express.Router();


// router.post('/create',isAuthenticated, upload.single('image'), createDiscussion);
router.post('/create',isAuthenticated, createDiscussion);
router.patch('/update',isAuthenticated, updateDiscussion);
router.delete('/delete/:discussionId',isAuthenticated, deleteDiscussion);
router.get('/search',isAuthenticated, getDiscussions);

router.post('/like', isAuthenticated, likeItem);
router.post('/:discussionId/view', isAuthenticated, incrementViewCount);

export default router;