import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId, //Foreign key
    ref: 'user'
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, default: 'General' },
  // date:{type:Date, default:Date.now}
},
  {
    timestamps: true, // maintain operation time
  });

// Creating mongoose schema
const Note = mongoose.model('Note', noteSchema);
export default Note;