import express from "express";
import {
  getAllCategories,
  getBrands,
  getLaptopCategories,
  createCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories (brands and laptop categories)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [brand, category]
 *         description: Filter by type (optional)
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get("/brands", getBrands);

/**
 * @swagger
 * /api/categories/laptop-categories:
 *   get:
 *     summary: Get all laptop categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of laptop categories
 */
router.get("/laptop-categories", getLaptopCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category or brand
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [brand, category]
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/", createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete("/:id", deleteCategory);

export default router;
