import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const rootDir = path.resolve(import.meta.dirname, "..");
const sqlPath = path.join(
  rootDir,
  "prisma",
  "migrations",
  "20260410111932_init",
  "migration.sql"
);

function resolveDbPath() {
  const url = process.env.DATABASE_URL;

  if (!url?.startsWith("file:")) {
    throw new Error("DATABASE_URL must use a file: SQLite URL");
  }

  const dbPath = url.slice("file:".length);
  return path.isAbsolute(dbPath) ? dbPath : path.resolve(rootDir, dbPath);
}

const dbPath = resolveDbPath();
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sql = fs.readFileSync(sqlPath, "utf8");
const db = new Database(dbPath);

try {
  db.exec(sql);
  console.log(`Initialized SQLite schema at ${dbPath}`);
} finally {
  db.close();
}
