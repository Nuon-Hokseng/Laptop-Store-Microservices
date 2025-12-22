import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import laptopRoutes from "./src/routes/laptop.routes.js";
import { swaggerSpec } from "./src/config/swagger.js";

dotenv.config();

const PORT = process.env.PORT || process.env.SERVICE_PORT || 3000;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/laptops", laptopRoutes);
app.get("/health", (req, res) => res.json({ status: "UP" }));

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("MongoDB connected");
    const server = app.listen(PORT, () =>
      console.log(`Laptop Service running on port ${PORT}`)
    );
    process.on("SIGTERM", () => {
      console.log(
        "SIGTERM received, shutting down Laptop Service gracefully..."
      );
      server.close(() => process.exit(0));
    });
  })
  .catch((err) => console.error(err));
