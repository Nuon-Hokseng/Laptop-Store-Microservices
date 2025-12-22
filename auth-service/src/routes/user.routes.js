import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  updateUserValidator,
  updatePasswordValidator,
} from "../middleware/validators/user.validator.js";
import { validate } from "../middleware/validators/validator.js";

import {
  getProfile,
  updateProfile,
  updatePassword,
} from "../controllers/user.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/profile",
  authMiddleware,
  updateUserValidator,
  validate,
  updateProfile
);

/**
 * @swagger
 * /api/user/password:
 *   patch:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/password",
  authMiddleware,
  updatePasswordValidator,
  validate,
  updatePassword
);

export default router;
