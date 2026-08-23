import { existsSync, mkdirSync, readFileSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envLocalPath = path.join(root, ".env.local");
const envExamplePath = path.join(root, ".env.local.example");
const packageJsonPath = path.join(root, "package.json");

function parseEnvFile(filePath) {
  const env = {};
  const raw = readFileSync(filePath, "utf8");

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function run(command, args, env, options = {}) {
  console.log(`> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: root,
    env: { ...process.env, ...env },
    shell: true,
    stdio: options.capture ? "pipe" : "inherit",
    encoding: options.capture ? "utf8" : undefined,
  });

  if (result.error) {
    console.error(result.error.message);
  }

  if (result.status !== 0 && options.required !== false) {
    process.exit(result.status ?? 1);
  }

  return result;
}

function sqlitePathFromDatabaseUrl(databaseUrl) {
  if (!databaseUrl?.startsWith("file:")) {
    throw new Error("Only local SQLite file: DATABASE_URL values are supported by setup:local.");
  }

  const value = databaseUrl.slice("file:".length);
  if (path.isAbsolute(value)) return value;

  // Prisma SQLite paths are schema-relative. The schema lives in prisma/schema.prisma.
  return path.resolve(root, "prisma", value);
}

async function createSqliteSchemaFromPrisma(env) {
  console.warn("Prisma db push failed; creating local SQLite schema from Prisma migrate diff SQL.");

  const diff = run(
    "npx",
    ["prisma", "migrate", "diff", "--from-empty", "--to-schema", "prisma/schema.prisma", "--script"],
    env,
    { capture: true },
  );

  const sql = diff.stdout
    .split(/\r?\n/)
    .filter((line) => !line.startsWith("Loaded Prisma config"))
    .join("\n")
    .trim();

  if (!sql) {
    throw new Error("Prisma migrate diff did not return SQL.");
  }

  const dbPath = sqlitePathFromDatabaseUrl(env.DATABASE_URL);
  mkdirSync(path.dirname(dbPath), { recursive: true });

  const { default: Database } = await import("better-sqlite3");
  const db = new Database(dbPath);
  try {
    db.exec("PRAGMA foreign_keys = ON;");
    db.exec(sql);
  } finally {
    db.close();
  }
}

if (!existsSync(envExamplePath)) {
  console.error(".env.local.example was not found. Cannot create local env.");
  process.exit(1);
}

if (!existsSync(packageJsonPath)) {
  console.error("package.json was not found. Run this script from the site project.");
  process.exit(1);
}

if (!existsSync(envLocalPath)) {
  copyFileSync(envExamplePath, envLocalPath);
  console.log("Created .env.local from .env.local.example.");
} else {
  console.log(".env.local already exists; leaving it unchanged.");
}

const localEnv = parseEnvFile(envLocalPath);
const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const scripts = pkg.scripts ?? {};

run("npx", ["prisma", "generate"], localEnv);
const dbPush = run("npx", ["prisma", "db", "push"], localEnv, { required: false });
if (dbPush.status !== 0) {
  await createSqliteSchemaFromPrisma(localEnv);
}

if (scripts["db:seed"]) {
  run("npm", ["run", "db:seed"], localEnv);
} else if (pkg.prisma?.seed) {
  run("npx", ["prisma", "db", "seed"], localEnv);
} else {
  console.warn("No db:seed script or prisma.seed command found; skipping seed.");
}
