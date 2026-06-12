import { Database } from "bun:sqlite";
import { PrismaClient } from "@prisma/client";

async function main() {
  console.log("Connecting to Prisma (PostgreSQL)...");
  const prisma = new PrismaClient();
  
  console.log("Connecting to SQLite...");
  const db = new Database("./db/custom.db", { readonly: true });

  const models = [
    "User",
    "Project",
    "LandingContent",
    "SiteSetting",
    "Event",
    "Partner"
  ];

  let totalMigrated = 0;

  for (const model of models) {
    console.log(`\n--- Migrating table: ${model} ---`);
    try {
      const query = db.query(`SELECT * FROM "${model}"`);
      const rows = query.all();
      console.log(`Found ${rows.length} rows in SQLite.`);
      
      let successCount = 0;
      for (const row of rows as any[]) {
        // Map Booleans from integer (1/0)
        if (model === "User") row.isActive = Boolean(row.isActive);
        if (model === "Project") row.hasPartner = Boolean(row.hasPartner);
        if (model === "LandingContent") row.isActive = Boolean(row.isActive);
        if (model === "Event") row.isActive = Boolean(row.isActive);
        if (model === "Partner") row.isActive = Boolean(row.isActive);
        
        // Map Dates from timestamp or string to Date objects
        if (row.createdAt) row.createdAt = new Date(row.createdAt);
        if (row.updatedAt) row.updatedAt = new Date(row.updatedAt);
        if (row.date) row.date = new Date(row.date);

        try {
          const clientModelName = model.charAt(0).toLowerCase() + model.slice(1);
          await (prisma as any)[clientModelName].create({ data: row });
          successCount++;
          totalMigrated++;
        } catch (err: any) {
          console.error(`[Error] Failed to insert row into ${model}:`, err.message);
        }
      }
      console.log(`Successfully migrated ${successCount}/${rows.length} rows for ${model}.`);
    } catch (err: any) {
      console.error(`[Error] Failed to query table ${model}:`, err.message);
    }
  }

  console.log(`\n=== Migration complete! Total rows migrated: ${totalMigrated} ===`);
  await prisma.$disconnect();
}

main().catch(console.error);
