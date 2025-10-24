#!/usr/bin/env node

/**
 * Script para remover imports e renderizações de Header das páginas
 * que agora têm o Header no layout dos route groups (app) e (profile)
 */

const fs = require("fs");
const path = require("path");

function removeHeaderFromFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Remove import do Header
    const importHeaderPattern =
      /import\s+Header\s+from\s+["']@\/app\/components\/layout\/Header["'];?\n?/g;
    if (content.match(importHeaderPattern)) {
      content = content.replace(importHeaderPattern, "");
      modified = true;
    }

    // Remove <Header /> standalone
    const headerJsxPattern = /<Header\s*\/>/g;
    if (content.match(headerJsxPattern)) {
      content = content.replace(headerJsxPattern, "");
      modified = true;
    }

    // Remove linhas vazias duplicadas
    content = content.replace(/\n\n\n+/g, "\n\n");

    if (modified) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Removido Header de: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== "scripts") {
        walkDirectory(filePath, callback);
      }
    } else if (
      file.endsWith(".jsx") ||
      file.endsWith(".js") ||
      file.endsWith(".tsx") ||
      file.endsWith(".ts")
    ) {
      callback(filePath);
    }
  });
}

// Apenas processar páginas dentro de (app) e (profile)
const appGroupDir = path.join(__dirname, "..", "app", "(app)");
const profileGroupDir = path.join(__dirname, "..", "app", "(profile)");
let updatedCount = 0;

console.log("🔄 Removendo Header de páginas com layout...\n");

if (fs.existsSync(appGroupDir)) {
  walkDirectory(appGroupDir, (filePath) => {
    if (removeHeaderFromFile(filePath)) {
      updatedCount++;
    }
  });
}

if (fs.existsSync(profileGroupDir)) {
  walkDirectory(profileGroupDir, (filePath) => {
    if (removeHeaderFromFile(filePath)) {
      updatedCount++;
    }
  });
}

console.log(`\n✨ Concluído! ${updatedCount} arquivo(s) atualizado(s).`);
