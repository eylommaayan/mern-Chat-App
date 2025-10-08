import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId:{ type: Schema.Types.ObjectId, ref: "User", required: true },

    // טקסט לא חובה
    text: { type: String, default: "" },

    // תמונה (URL אחרי upload) לא חובה
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

// ולידציה: חייבים לפחות אחד – טקסט או תמונה
messageSchema.pre("validate", function (next) {
  if (!this.text && !this.image) {
    return next(new Error("Message must include text or image"));
  }
  next();
});

export default mongoose.model("Message", messageSchema);
