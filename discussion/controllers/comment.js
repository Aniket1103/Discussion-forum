import { Discussion } from "../models/discussion.js";
import { Comment } from "../models/comment.js";

export const createComment = async (req, res) => {
  try {
    const { parentId, text, type } = req.body;
    const userId = req.user._id;

    if (!userId || !text || !parentId) {
      return res.status(400).json({ error: 'Required fields are missing.' });
    }

    if (type !== 'comment' && type !== 'reply') {
      return res.status(400).json({ error: 'Invalid type. Must be "comment" or "reply".' });
    }

    const newComment = new Comment({
      userId,
      parentId,
      type,
      text
    });

    await newComment.save();

    if (type === 'comment') {
      await Discussion.findByIdAndUpdate(parentId, { $push: { comments: newComment._id } });
    } else {
      await Comment.findByIdAndUpdate(parentId, { $push: { replies: newComment._id } });
    }

    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId, text } = req.body;
    const userId = req.user._id;

    if (!commentId || !text) {
      return res.status(400).json({ error: 'Comment ID and text are required.' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this comment.' });
    }

    comment.text = text;
    const updatedComment = await comment.save();

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};



export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!commentId) {
      return res.status(400).json({ error: 'Comment ID is required.' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
    }

    if (comment.type === 'comment') {
      await Discussion.updateOne({ comments: commentId }, { $pull: { comments: commentId } });
    } else {
      await Comment.updateOne({ replies: commentId }, { $pull: { replies: commentId } });
    }

    await comment.deleteOne();

    return res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getComments = async (req, res) => {
  try {
    const { parentId } = req.query;

    if (!parentId) {
      return res.status(400).json({ error: 'Parent ID is required.' });
    }

    const comments = await Comment.find({ parentId: parentId, type: 'comment' }).populate('replies');
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const likeItem = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const validItemTypes = ['comment', 'reply', 'discussion'];

    if (!itemId || !itemType || !validItemTypes.includes(itemType)) {
      return res.status(400).json({ error: 'Invalid item ID or item type.' });
    }

    let item;

    if (itemType === 'discussion') {
      item = await Discussion.findById(itemId);
    } else {
      item = await Comment.findById(itemId);
    }

    if (!item) {
      return res.status(404).json({ error: `${itemType} not found.` });
    }

    item.likes += 1;
    await item.save();

    return res.status(200).json({ message: `${itemType} liked successfully.`, item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

