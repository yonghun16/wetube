import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 20 },
  description: { type: String, required: true, trim: true, maxLength: 200 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true }
  }
});

// mongoose pre middleware
videoSchema.pre('save', async function() {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map(word => word.trim()) // 앞뒤 공백 제거
    .filter(word => word !== "") // 빈 문자열 제거
    .map(word => word.startsWith("#") ? word : `#${word}`);
  console.log("pre middleware", this);
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
