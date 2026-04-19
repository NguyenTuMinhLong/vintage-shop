import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import {
  createProduct,
  createUser,
  deleteProduct,
  findOrCreateCategory,
  findUserByEmail,
  findProductById,
  listProducts,
  updateProduct,
} from "../lib/store.js";

const router = express.Router();

async function getDefaultCategoryId() {
  return findOrCreateCategory({
    name: "General",
    slug: "general",
  }).id;
}

// GET products with search + pagination
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const search = req.query.search?.trim() || "";

    const { products, total } = listProducts({ page, limit, search });

    res.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET single product (public)
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = findProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { createdBy, categoryId, ...publicProduct } = product;
    res.json(publicProduct);
  } catch (err) {
    console.error("GET /products/:id error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// CREATE product
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const {
      name,
      price,
      stock,
      imageUrl,
      description,
      measurementsText,
      conditionText,
      overallScore,
      materials,
      sashikoNotes,
      careInstructions,
      patchZones,
      patchFabric,
      patchStyle,
      patchNotes,
      repairDifficulty,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const categoryId = await getDefaultCategoryId();

    const product = createProduct({
      name: name.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      imageUrl: imageUrl?.trim() || null,
      description: description?.trim() || null,
      measurementsText: measurementsText?.trim() || null,
      conditionText: conditionText?.trim() || null,
      overallScore:
        overallScore === undefined || overallScore === null || String(overallScore).trim() === ""
          ? null
          : Number(overallScore),
      materials: materials?.trim() || null,
      sashikoNotes: sashikoNotes?.trim() || null,
      careInstructions: careInstructions?.trim() || null,
      patchZones: patchZones?.trim() || null,
      patchFabric: patchFabric?.trim() || null,
      patchStyle: patchStyle?.trim() || null,
      patchNotes: patchNotes?.trim() || null,
      repairDifficulty: repairDifficulty?.trim() || null,
      categoryId,
      createdBy: req.user.userId,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({
      error: "Failed to create product",
      detail: err.message,
    });
  }
});

// UPDATE product
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const id = Number(req.params.id);
    const {
      name,
      price,
      stock,
      imageUrl,
      description,
      measurementsText,
      conditionText,
      overallScore,
      materials,
      sashikoNotes,
      careInstructions,
      patchZones,
      patchFabric,
      patchStyle,
      patchNotes,
      repairDifficulty,
    } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updatedProduct = updateProduct(id, {
      name: name.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      imageUrl: imageUrl?.trim() || null,
      description: description?.trim() || null,
      measurementsText: measurementsText?.trim() || null,
      conditionText: conditionText?.trim() || null,
      overallScore:
        overallScore === undefined || overallScore === null || String(overallScore).trim() === ""
          ? null
          : Number(overallScore),
      materials: materials?.trim() || null,
      sashikoNotes: sashikoNotes?.trim() || null,
      careInstructions: careInstructions?.trim() || null,
      patchZones: patchZones?.trim() || null,
      patchFabric: patchFabric?.trim() || null,
      patchStyle: patchStyle?.trim() || null,
      patchNotes: patchNotes?.trim() || null,
      repairDifficulty: repairDifficulty?.trim() || null,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    res.status(500).json({
      error: "Update failed",
      detail: err.message,
    });
  }
});

// DELETE product
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const removed = deleteProduct(id);

    if (!removed) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({
      error: "Delete failed",
      detail: err.message,
    });
  }
});

// Seed default user + category
router.post("/seed", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production" && process.env.ENABLE_SEED_ROUTE !== "true") {
      return res.status(404).json({ error: "Not found" });
    }

    const existingUser = findUserByEmail("admin@test.com");

    let user = existingUser;
    if (!user) {
      user = createUser({
        name: "Admin",
        email: "admin@test.com",
        password: await bcrypt.hash("123456", 10),
        role: "admin",
      });
    }

    const category = findOrCreateCategory({
      name: "Jacket",
      slug: "jacket",
    });

    res.json({
      message: "Seed completed",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      category,
    });
  } catch (err) {
    console.error("POST /products/seed error:", err);
    res.status(500).json({
      error: "Seed failed",
      detail: err.message,
    });
  }
});

export default router;
