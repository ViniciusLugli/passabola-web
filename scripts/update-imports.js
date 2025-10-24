#!/usr/bin/env node

/**
 * Script para atualizar imports após reorganização de componentes
 *
 * Mapeamento de componentes para suas novas localizações:
 * - layout/: Header, BackgroundDecorations, AuthLayout, PrivateRoute
 * - ui/: Button, Input, Modal, Toast, Alert, SearchBar, SelectInput, JoinGameModal
 * - cards/: GameCard, PostCard, TeamCard, TeamInviteCard, UserListCard, NotificationCard, InviteNotificationActions
 * - lists/: PostList, TeamList, TeamInviteList
 * - forms/: CreateTeamForm
 * - chat/: ConversationItem, MessageBubble, MessageInput
 * - profile/: ProfileHeader
 */

const fs = require("fs");
const path = require("path");

// Mapeamento de componentes para suas novas pastas
const componentMap = {
  // Layout components
  Header: "layout",
  BackgroundDecorations: "layout",
  AuthLayout: "layout",
  PrivateRoute: "layout",

  // UI components
  Button: "ui",
  Input: "ui",
  Modal: "ui",
  Toast: "ui",
  Alert: "ui",
  SearchBar: "ui",
  SelectInput: "ui",
  JoinGameModal: "ui",

  // Card components
  GameCard: "cards",
  PostCard: "cards",
  TeamCard: "cards",
  TeamInviteCard: "cards",
  UserListCard: "cards",
  NotificationCard: "cards",
  InviteNotificationActions: "cards",

  // List components
  PostList: "lists",
  TeamList: "lists",
  TeamInviteList: "lists",

  // Form components
  CreateTeamForm: "forms",

  // Chat components
  ConversationItem: "chat",
  MessageBubble: "chat",
  MessageInput: "chat",

  // Profile components
  ProfileHeader: "profile",
};

function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Para cada componente no mapa
    for (const [component, folder] of Object.entries(componentMap)) {
      // Regex para encontrar imports do componente (com ou sem subfolder)
      const oldImportPattern = new RegExp(
        `from ["']@/app/components/${component}["']`,
        "g"
      );

      // Novo import path
      const newImport = `from "@/app/components/${folder}/${component}"`;

      // Verifica se o arquivo contém o import antigo
      if (content.match(oldImportPattern)) {
        content = content.replace(oldImportPattern, newImport);
        modified = true;
      }
    }

    // Se o arquivo foi modificado, salva
    if (modified) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Atualizado: ${filePath}`);
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
      // Ignora node_modules e .next
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

// Executa o script
const appDir = path.join(__dirname, "..", "app");
let updatedCount = 0;

console.log("🔄 Iniciando atualização de imports...\n");

walkDirectory(appDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    updatedCount++;
  }
});

console.log(`\n✨ Concluído! ${updatedCount} arquivo(s) atualizado(s).`);
