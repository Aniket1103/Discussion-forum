import { Discussion } from "../models/discussion.js";
import cloudinary from "cloudinary";
import { promisify } from 'util';
import fs from 'fs';

const cloudinaryUpload = promisify(cloudinary.v2.uploader.upload);

export const getDiscussions = async (req, res) => {
  try {
    const { tags, searchText } = req.query;

    const query = {};

    if (tags) {
      query.hashTags = { $in: tags.split(',') };
    }

    if (searchText) {
      query.text = { $regex: searchText, $options: 'i' };
    }

    const discussions = await Discussion.find(query).populate('comments');
    return res.status(200).json(discussions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { text, hashTags } = req.body;
    const userId = req.user._id.toString();
    console.log("in createDiscussion", req.body, req.files);

    const file = req.files?.image;

    if (!userId || !text) {
      return res.status(400).json({ error: 'User ID and text are required.' });
    }

    let imageUrl = '';
    // console.log(file);
    // const postMedia = req.files.postMedia.tempFilePath;

    // const mycloud = await cloudinary.v2.uploader.upload(file);

    // console.log(mycloud);
    // mediaUrl = mycloud.secure_url;

    if (file) {
      const result = await cloudinaryUpload(file.tempFilePath);
      console.log("file", file)
      imageUrl = result.secure_url;
      fs.rmSync("./tmp", { recursive: true });
    }

    const newDiscussion = new Discussion({
      userId,
      text,
      image: imageUrl,
      hashTags: hashTags.split(",")
    });

    await newDiscussion.save();
    return res.status(201).json(newDiscussion);
  } catch (error) {
    console.error("Error while creating a discussion Post ", error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};


export const updateDiscussion = async (req, res) => {
  try {
    const { discussionId, text, hashTags } = req.body;
    const userId = req.user._id;
    const file = req.files?.image;

    if (!discussionId) {
      return res.status(400).json({ error: 'Discussion ID is required.' });
    }

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found.' });
    }

    if (discussion.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this discussion.' });
    }

    let imageUrl = '';

    if (file) {
      const result = await cloudinaryUpload(file.tempFilePath);
      console.log("file", file)
      imageUrl = result.secure_url;
      fs.rmSync("./tmp", { recursive: true });
    }

    discussion.text = text || discussion.text;
    discussion.image = imageUrl || discussion.image;
    discussion.hashTags = hashTags.split(",") || discussion.hashTags;

    const updatedDiscussion = await discussion.save();

    return res.status(200).json(updatedDiscussion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user._id;
    console.log(req.params)

    if (!discussionId) {
      return res.status(400).json({ error: 'Discussion ID is required.' });
    }

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found.' });
    }

    if (discussion.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this discussion.' });
    }

    await discussion.deleteOne();

    return res.status(200).json({ message: 'Discussion deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const incrementViewCount = async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await Discussion.findByIdAndUpdate(
      discussionId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found.' });
    }

    return res.status(200).json(discussion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};