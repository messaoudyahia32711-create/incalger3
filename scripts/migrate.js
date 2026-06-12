const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const db = new sqlite3.Database('./db/custom.db', sqlite3.OPEN_READONLY);
const prisma = new PrismaClient();

function queryAll(table) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM "${table}"`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function main() {
  console.log("Connecting to Prisma (PostgreSQL)...");
  
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
      const rows = await queryAll(model);
      console.log(`Found ${rows.length} rows in SQLite.`);
      
      let successCount = 0;
      for (const row of rows) {
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
          await prisma[clientModelName].create({ data: row });
          successCount++;
          totalMigrated++;
        } catch (err) {
          console.error(`[Error] Failed to insert row into ${model}:`, err.message);
        }
      }
      console.log(`Successfully migrated ${successCount}/${rows.length} rows for ${model}.`);
    } catch (err) {
      console.error(`[Error] Failed to query table ${model}:`, err.message);
    }
  }

  console.log(`\n=== Migration complete! Total rows migrated: ${totalMigrated} ===`);
  await prisma.$disconnect();
  db.close();
}

main().catch(console.error);
