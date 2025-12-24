import Category from "../models/category.model.js";

export const getAllCategories = async (req, res) => {
  try {
    const { type } = req.query;

    let query = {};
    if (type && (type === "brand" || type === "category")) {
      query.type = type;
    }

    const categories = await Category.find(query).lean().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBrands = async (_req, res) => {
  try {
    const brands = await Category.find({ type: "brand" })
      .lean()
      .sort({ name: 1 });
    // Return as array of strings in the expected format
    res.json({ brands: brands.map((b) => b.name) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLaptopCategories = async (_req, res) => {
  try {
    const categories = await Category.find({ type: "category" })
      .lean()
      .sort({ name: 1 });
    // Return as array of strings in the expected format
    res.json({ categories: categories.map((c) => c.name) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Name and type are required",
      });
    }

    if (type !== "brand" && type !== "category") {
      return res.status(400).json({
        message: "Type must be either 'brand' or 'category'",
      });
    }

    // Check if already exists
    const existing = await Category.findOne({ name, type });
    if (existing) {
      return res.status(409).json({
        message: `${type} '${name}' already exists`,
      });
    }

    const category = await Category.create({ name, type });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
