import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    laptop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "laptop",
      required: true,
    },
    // Snapshot fields (so cart still renders if laptop-service is cold/unreachable)
    unitPrice: { type: Number, default: 0, min: 0 },
    brand: { type: String, default: "" },
    model: { type: String, default: "" },
    category: { type: String, default: "" },
    image_url: { type: String, default: "" },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("CartItem", cartItemSchema);
