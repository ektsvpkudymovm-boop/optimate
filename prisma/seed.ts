import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { validateAdminEnv } from "../src/lib/admin-env";
import { hashPassword } from "../src/lib/password";

const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const { email, password } = validateAdminEnv();
  const passwordHash = await hashPassword(password);

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash, role: "OWNER" },
    });
    console.log(`Admin user updated: ${email}`);
    return;
  }

  await prisma.adminUser.create({
    data: { email, passwordHash, role: "OWNER" },
  });

  console.log(`Admin user created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : "Seed failed.");
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
