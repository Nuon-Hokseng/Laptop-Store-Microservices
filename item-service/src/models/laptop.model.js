import mongoose from "mongoose";

const LaptopSchema = new mongoose.Schema(
  {
    Brand: { type: String, required: true },
    Model: { type: String, required: true },
    Spec: { type: String, required: true },
    description: { type: String },
    image_url: { type: String },
    category: { type: String }, // just store category as string
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("laptop", LaptopSchema);
