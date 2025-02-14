import mongoose from "mongoose";
import bcrypt from "bcrypt";


// mongoose Schema 생성
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: String, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
});

// bcrypt를 사용하여 password 암호화
// Schema의  pre middleware 사용
userSchema.pre('save', async function() {
  console.log("Users password :", this.password);
  this.password = await bcrypt.hash(this.password, 5);
  console.log("Hashed password :", this.password);
})

// mongoose Model 등록 (userSchema 사용)
const User = mongoose.model("User", userSchema);

// Model export
export default User;
