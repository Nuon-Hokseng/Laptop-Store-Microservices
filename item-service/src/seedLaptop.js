import mongoose from "mongoose";
import dotenv from "dotenv";
import Laptop from "./models/laptop.model.js";

dotenv.config();

const demoLaptops = [
  {
    Brand: "Apple",
    Model: "MacBook Pro 14",
    Spec: "M3 Pro, 16GB RAM, 512GB SSD",
    category: "Creator",
    description: "Powerful creator laptop with stellar battery life.",
    image_url:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1696987339082",
    price: 1999,
  },
  {
    Brand: "Dell",
    Model: "XPS 13 Plus",
    Spec: "Intel i7, 16GB RAM, 1TB SSD",
    category: "Ultrabook",
    description: "Premium thin-and-light with InfinityEdge display.",
    image_url:
      "https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/page/category/laptop/xps-13-9315-t-gray-cn-800x620.png",
    price: 1799,
  },
  {
    Brand: "Lenovo",
    Model: "ThinkPad X1 Carbon",
    Spec: "Intel i7, 32GB RAM, 1TB SSD",
    category: "Business",
    description: "Lightweight business laptop with legendary keyboard.",
    image_url:
      "https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen10.png",
    price: 1899,
  },
  {
    Brand: "ASUS",
    Model: "ROG Zephyrus G14",
    Spec: "AMD Ryzen 9, RTX 4060, 16GB RAM, 1TB SSD",
    category: "Gaming",
    description: "Compact gaming powerhouse with high refresh display.",
    image_url:
      "https://dlcdnwebimgs.asus.com/gain/8ef84b6f-062b-42f1-98c8-6f4595fe2c24/",
    price: 1699,
  },
  {
    Brand: "HP",
    Model: "Spectre x360 14",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "2-in-1",
    description: "Convertible with OLED display and premium build.",
    image_url:
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c07965322.png",
    price: 1599,
  },
  {
    Brand: "Acer",
    Model: "Swift Go 14",
    Spec: "Intel i5, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Lightweight everyday laptop with long battery life.",
    image_url:
      "https://static.acer.com/up/Resource/Acer/Notebooks/Swift_Go_14/Images/20230529/Swift_Go_14_SFG14-42_Fingerprint_modelmain.png",
    price: 1099,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB");

    await Laptop.deleteMany({});
    console.log("Cleared existing laptops");

    await Laptop.insertMany(demoLaptops);
    console.log(`Successfully seeded ${demoLaptops.length} laptops`);

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
