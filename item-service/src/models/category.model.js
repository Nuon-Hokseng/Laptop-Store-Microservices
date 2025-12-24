import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ["brand", "category"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("category", CategorySchema);
