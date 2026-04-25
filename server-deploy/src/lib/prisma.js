import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "../..");

function resolveDatabaseUrl(databaseUrl) {
  if (!databaseUrl?.startsWith("file:")) {
    return databaseUrl;
  }

  const dbPath = databaseUrl.replace(/^file:/, "");

  if (!dbPath || path.isAbsolute(dbPath)) {
    return databaseUrl;
  }

  return `file:${path.resolve(serverRoot, dbPath)}`;
}

const adapter = new PrismaBetterSqlite3({
  url: resolveDatabaseUrl(process.env.DATABASE_URL),
});

export const prisma = new PrismaClient({ adapter });
