import * as fs from 'fs';
import * as path from 'path';

const SCHEMA_DIR = path.join(__dirname, '../../modules');
const OUTPUT_SCHEMA = path.join(__dirname, '../../core/database/schema.prisma');

const baseSchema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

`;

function findPrismaFiles(dir: string): string[] {
  const files: string[] = [];

  function walkDir(currentDir: string) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'node_modules' && item !== 'dist') {
        walkDir(fullPath);
      } else if (item.endsWith('.prisma') && !item.includes('schema.prisma')) {
        files.push(fullPath);
      }
    }
  }

  walkDir(dir);
  return files;
}

function buildSchema() {
  const prismaFiles = findPrismaFiles(SCHEMA_DIR);
  let combinedSchema = baseSchema;

  for (const file of prismaFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    combinedSchema += `\n// From: ${path.relative(SCHEMA_DIR, file)}\n`;
    combinedSchema += content + '\n';
  }

  fs.writeFileSync(OUTPUT_SCHEMA, combinedSchema);
  console.log(`✅ Schema built with ${prismaFiles.length} module(s)`);
  console.log(`📁 Output: ${OUTPUT_SCHEMA}`);
}

buildSchema();
