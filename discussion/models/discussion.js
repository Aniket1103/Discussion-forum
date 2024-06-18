import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const discussionSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String 
  },
  hashTags: [{ 
    type: String 
  }],
  comments: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
  likes: { 
    type: Number, 
    default: 0 
  },
  views: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

export const Discussion = model('Discussion', discussionSchema);
