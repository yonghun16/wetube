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

// static method를 사용하여 스키마 객체에 Custom method를 추가 및 정의 가능
// hashtags의 format을 정의
videoSchema.static("formatHashtags", function(hashtags) {
  return hashtags
    .split(",")
    .map(word => word.trim())          // 앞뒤 공백 제거
    .filter(word => word !== "")       // 빈 문자열 제거
    .map(word => word.startsWith("#") ? word : `#${word}`);  // 단어의 처음시작이 #로 시작하는지 확인
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
