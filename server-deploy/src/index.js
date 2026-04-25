import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, "../../client/dist");
const clientIndexPath = path.join(clientPath, "index.html");
const shouldServeClient =
  process.env.SERVE_CLIENT === "true" || existsSync(clientIndexPath);

app.use(
  cors({
    origin: allowedOrigins?.length ? allowedOrigins : true,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

if (shouldServeClient) {
  app.use(express.static(clientPath));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(clientIndexPath);
  });
} else {
  app.get("/", (req, res) => {
    res.json({ status: "backend-only" });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
