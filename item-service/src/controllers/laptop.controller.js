import Laptop from "../models/laptop.model.js";

const mapLaptop = (doc) => ({
  _id: doc._id.toString(),
  Brand: doc.Brand,
  Model: doc.Model,
  Spec: doc.Spec,
  price: doc.price,
  category: doc.category,
  description: doc.description,
  image_url: doc.image_url,
  coverImage: doc.image_url,
});

export const getAllLaptops = async (_req, res) => {
  try {
    const laptops = await Laptop.find().lean();
    console.log(`[Laptop Controller] Returning ${laptops.length} laptops`);

    if (laptops.length === 0) {
      console.warn(
        "[Laptop Controller] No laptops found in database. Run seed script!"
      );
    } else {
      console.log(
        `[Laptop Controller] Sample laptop IDs: ${laptops
          .slice(0, 3)
          .map((l) => l._id)
          .join(", ")}`
      );
    }

    res.json(laptops.map(mapLaptop));
  } catch (error) {
    console.error("[Laptop Controller] Error fetching laptops:", error);
    res.status(500).json({ message: error.message });
  }
};

export const searchLaptops = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const laptops = await Laptop.find({
      $or: [
        { Brand: { $regex: query, $options: "i" } },
        { Model: { $regex: query, $options: "i" } },
        { Spec: { $regex: query, $options: "i" } },
      ],
    }).lean();

    res.json(laptops.map(mapLaptop));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLaptopsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category || category.trim() === "") {
      return res.status(400).json({ message: "Category is required" });
    }

    const laptops = await Laptop.find({
      category: { $regex: category.trim(), $options: "i" },
    }).lean();

    if (laptops.length === 0) {
      return res
        .status(404)
        .json({ message: "No laptops found for this category" });
    }

    res.json(laptops.map(mapLaptop));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLaptopDetail = async (req, res) => {
  try {
    const id = req.params.id?.trim();

    console.log(`[Laptop Controller] Fetching laptop with ID: ${id}`);

    // Validate MongoDB ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`[Laptop Controller] Invalid laptop ID format: ${id}`);
      return res.status(400).json({
        message: "Invalid laptop ID format",
        providedId: id,
      });
    }

    const laptop = await Laptop.findById(id).lean();

    if (!laptop) {
      console.warn(`[Laptop Controller] Laptop not found: ${id}`);

      // Provide helpful debugging info
      const totalLaptops = await Laptop.countDocuments();
      console.log(
        `[Laptop Controller] Total laptops in database: ${totalLaptops}`
      );

      return res.status(404).json({
        message: "Laptop not found",
        providedId: id,
        totalLaptopsInDatabase: totalLaptops,
        hint:
          totalLaptops === 0
            ? "Database appears empty. Run the seed script: npm run seed"
            : "The laptop ID you provided does not exist in the database",
      });
    }

    console.log(
      `[Laptop Controller] Successfully found laptop: ${laptop.Brand} ${laptop.Model}`
    );
    res.json(mapLaptop(laptop));
  } catch (error) {
    console.error(`[Laptop Controller] Error fetching laptop:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const createLaptop = async (req, res) => {
  try {
    const { Brand, Model, Spec, price, category, description, image_url } =
      req.body;

    if (!Brand || !Model || !Spec || !price || !category) {
      return res.status(400).json({
        message: "Brand, Model, Spec, price, and category are required",
      });
    }

    const laptop = await Laptop.create({
      Brand,
      Model,
      Spec,
      price,
      category,
      description,
      image_url,
    });

    res.status(201).json(mapLaptop(laptop));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLaptop = async (req, res) => {
  try {
    const { id } = req.params;

    const laptop = await Laptop.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }

    res.json(mapLaptop(laptop));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLaptop = async (req, res) => {
  try {
    const { id } = req.params;

    const laptop = await Laptop.findByIdAndDelete(id).lean();

    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }

    res.json({
      message: "Laptop deleted successfully",
      laptop: mapLaptop(laptop),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Guarded seed endpoint to populate demo laptops via HTTP (development use only)
export const seedDemoLaptops = async (req, res) => {
  try {
    const enabled = process.env.ENABLE_SEED_ENDPOINT === "true";
    const adminToken = process.env.SEED_ADMIN_TOKEN || "";
    const provided = req.get("X-Admin-Token") || req.get("x-admin-token") || "";

    if (!enabled) {
      return res.status(403).json({
        message:
          "Seed endpoint disabled. Set ENABLE_SEED_ENDPOINT=true to enable",
      });
    }

    if (!adminToken || provided !== adminToken) {
      return res.status(403).json({
        message: "Forbidden: invalid admin token",
      });
    }

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

    const { reset } = req.query;
    if (reset === "true") {
      await Laptop.deleteMany({});
    }

    const count = await Laptop.countDocuments();
    if (count === 0 || reset === "true") {
      const inserted = await Laptop.insertMany(demoLaptops);
      return res.status(201).json({
        message: "Seeded demo laptops",
        inserted: inserted.length,
      });
    }

    return res.status(200).json({
      message: "Database already contains laptops",
      existingCount: count,
    });
  } catch (error) {
    console.error("[Seed Endpoint] Error:", error);
    res.status(500).json({ message: error.message });
  }
};
