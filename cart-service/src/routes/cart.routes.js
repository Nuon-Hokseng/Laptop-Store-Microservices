import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getCart,
  addToCart,
  removeOneFromCart,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import serviceAuthMiddleware from "../middleware/service.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */
router.get("/cart", authMiddleware, getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Book not found or invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/cart/add", authMiddleware, addToCart);

/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     summary: Remove one quantity from cart item
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId]
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item quantity decreased successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/cart/remove", authMiddleware, removeOneFromCart);

/**
 * @swagger
 * /api/cart/item/{itemId}:
 *   delete:
 *     summary: Remove cart item completely
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/cart/item/:itemId", authMiddleware, removeCartItem);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear entire cart (service-to-service only)
 *     tags: [Cart]
 *     security:
 *       - serviceToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       403:
 *         description: Invalid service token
 */
router.delete("/cart/clear", serviceAuthMiddleware, clearCart);

export default router;
