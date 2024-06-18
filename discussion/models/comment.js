import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  parentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Comment' 
  },
  type: { 
    type: String, 
    enum: ['comment', 'reply'], 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  likes: { 
    type: Number, 
    default: 0 
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

export const Comment = model('Comment', commentSchema);
