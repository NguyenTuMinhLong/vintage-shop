import express from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import bcrypt from "bcrypt";

const router = express.Router();

// GET products with search + pagination
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const search = req.query.search?.trim() || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          name: {
            contains: search,
          },
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { id: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

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

// CREATE product
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, stock, imageUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        imageUrl: imageUrl?.trim() || null,
        categoryId: 1,
        createdBy: req.user.userId,
      },
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
    const id = Number(req.params.id);
    const { name, price, stock, imageUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        imageUrl: imageUrl?.trim() || null,
      },
    });

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
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

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
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@test.com" },
    });

    let user = existingUser;
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Admin",
          email: "admin@test.com",
          password: await bcrypt.hash("123456", 10),
          role: "admin",
        },
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { slug: "jacket" },
    });

    let category = existingCategory;
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Jacket",
          slug: "jacket",
        },
      });
    }

    res.json({
      message: "Seed completed",
      user,
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