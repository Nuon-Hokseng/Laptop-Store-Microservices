import express from "express";
import {
  getAllLaptops,
  searchLaptops,
  getLaptopsByCategory,
  getLaptopDetail,
  createLaptop,
  updateLaptop,
  deleteLaptop,
} from "../controllers/laptop.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Laptops
 *   description: Laptop catalog and management
 */

/**
 * @swagger
 * /laptops:
 *   get:
 *     summary: Get all laptops
 *     tags: [Laptops]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all laptops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Laptop'
 */
router.get("/", getAllLaptops);

/**
 * @swagger
 * /laptops/search:
 *   get:
 *     summary: Search laptops by brand, model, or spec
 *     tags: [Laptops]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of laptops matching the search
 */
router.get("/search", searchLaptops);

/**
 * @swagger
 * /laptops/category:
 *   get:
 *     summary: Get laptops by category
 *     tags: [Laptops]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: List of laptops in the category
 */
router.get("/category", getLaptopsByCategory);

/**
 * @swagger
 * /laptops/{id}:
 *   get:
 *     summary: Get laptop details by ID
 *     tags: [Laptops]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Laptop ID
 *     responses:
 *       200:
 *         description: Laptop details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Laptop'
 */
router.get("/:id", getLaptopDetail);

/**
 * @swagger
 * /laptops:
 *   post:
 *     summary: Create a new laptop
 *     tags: [Laptops]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LaptopInput'
 *     responses:
 *       201:
 *         description: Laptop created successfully
 */
router.post("/", createLaptop);

/**
 * @swagger
 * /laptops/{id}:
 *   put:
 *     summary: Update a laptop
 *     tags: [Laptops]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LaptopInput'
 *     responses:
 *       200:
 *         description: Laptop updated successfully
 */
router.put("/:id", updateLaptop);

/**
 * @swagger
 * /laptops/{id}:
 *   delete:
 *     summary: Delete a laptop
 *     tags: [Laptops]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Laptop deleted successfully
 */
router.delete("/:id", deleteLaptop);

export default router;
