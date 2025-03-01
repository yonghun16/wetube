import mongoose from "mongoose";
import bcrypt from "bcrypt";


// mongoose Schema 생성
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: {type: String, default: ""},
  socialOnly: { type: Boolean , default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], // ObjectId가 Video 컬렉션의 문서를 참조 위해 ref 사용
});

// bcrypt를 사용하여 password 암호화
// Schema의  pre middleware 사용
userSchema.pre('save', async function() {
  if(this.isModified("password")){ // password가 변경된 경우만 암호화
    this.password = await bcrypt.hash(this.password, 5);
  }
})

// mongoose Model 등록 (userSchema 사용)
const User = mongoose.model("User", userSchema);

// Model export
export default User;
