import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    laptop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "laptop",
      required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("CartItem", cartItemSchema);
