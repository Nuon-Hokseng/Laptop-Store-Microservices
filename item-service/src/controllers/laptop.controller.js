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
