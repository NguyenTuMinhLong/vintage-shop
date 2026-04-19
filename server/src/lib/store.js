import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(serverRoot, ".env") });

function resolveStorePath() {
  const fileUrl = process.env.DATABASE_URL;

  if (fileUrl?.startsWith("file:")) {
    const filePath = fileUrl.slice("file:".length);
    return path.isAbsolute(filePath) ? filePath : path.resolve(serverRoot, filePath);
  }

  const sharedStorePath = path.resolve(serverRoot, "../shared/data/prod.db");
  const sharedRoot = path.resolve(serverRoot, "../shared");

  if (fs.existsSync(sharedRoot)) {
    return sharedStorePath;
  }

  return path.join(serverRoot, "data", "store.json");
}

const storePath = resolveStorePath();

function createEmptyStore() {
  return {
    users: [],
    categories: [],
    products: [],
    meta: {
      userId: 0,
      categoryId: 0,
      productId: 0,
    },
  };
}

function ensureStoreFile() {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });

  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify(createEmptyStore(), null, 2));
  }
}

function readStore() {
  ensureStoreFile();
  const raw = fs.readFileSync(storePath, "utf8");

  if (!raw.trim()) {
    return createEmptyStore();
  }

  const parsed = JSON.parse(raw);

  return {
    users: parsed.users ?? [],
    categories: parsed.categories ?? [],
    products: parsed.products ?? [],
    meta: parsed.meta ?? { userId: 0, categoryId: 0, productId: 0 },
  };
}

function writeStore(store) {
  ensureStoreFile();
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

function nextId(store, key) {
  store.meta[key] = (store.meta[key] ?? 0) + 1;
  return store.meta[key];
}

export function findUserByEmail(email) {
  return readStore().users.find((user) => user.email === email) ?? null;
}

export function createUser(data) {
  const store = readStore();
  const user = {
    id: nextId(store, "userId"),
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role ?? "user",
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  writeStore(store);
  return user;
}

export function findOrCreateCategory({ name, slug }) {
  const store = readStore();
  let category = store.categories.find((item) => item.slug === slug) ?? null;

  if (!category) {
    category = {
      id: nextId(store, "categoryId"),
      name,
      slug,
    };
    store.categories.push(category);
    writeStore(store);
  }

  return category;
}

export function listProducts({ page, limit, search }) {
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = readStore()
    .products.filter((product) =>
      normalizedSearch ? product.name.toLowerCase().includes(normalizedSearch) : true
    )
    .sort((a, b) => b.id - a.id);

  return {
    products: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
  };
}

export function createProduct(data) {
  const store = readStore();
  const product = {
    id: nextId(store, "productId"),
    name: data.name,
    description: data.description ?? null,
    measurementsText: data.measurementsText ?? null,
    conditionText: data.conditionText ?? null,
    overallScore: data.overallScore ?? null,
    materials: data.materials ?? null,
    sashikoNotes: data.sashikoNotes ?? null,
    careInstructions: data.careInstructions ?? null,
    patchZones: data.patchZones ?? null,
    patchFabric: data.patchFabric ?? null,
    patchStyle: data.patchStyle ?? null,
    patchNotes: data.patchNotes ?? null,
    repairDifficulty: data.repairDifficulty ?? null,
    price: data.price,
    stock: data.stock,
    imageUrl: data.imageUrl ?? null,
    createdAt: new Date().toISOString(),
    categoryId: data.categoryId,
    createdBy: data.createdBy,
  };

  store.products.push(product);
  writeStore(store);
  return product;
}

export function updateProduct(id, data) {
  const store = readStore();
  const index = store.products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  store.products[index] = {
    ...store.products[index],
    ...data,
  };

  writeStore(store);
  return store.products[index];
}

export function deleteProduct(id) {
  const store = readStore();
  const index = store.products.findIndex((product) => product.id === id);

  if (index === -1) {
    return false;
  }

  store.products.splice(index, 1);
  writeStore(store);
  return true;
}

export function findProductById(id) {
  const store = readStore();
  return store.products.find((product) => product.id === id) ?? null;
}
