import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // date:{type:Date, default:Date.now}
    // isAdmin: { type: Boolean, default:false, required: true },
  },
  {
    timestamps: true, // maintain operation time
  }
);

// Creating mongoose schema
const User = mongoose.model('User', userSchema);
// User.createIndexes()
export default User;