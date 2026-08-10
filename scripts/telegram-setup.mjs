#!/usr/bin/env node
/**
 * Run after setting TELEGRAM_BOT_TOKEN in .env.local and messaging your bot (tap Start).
 * Usage: node scripts/telegram-setup.mjs
 */
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local");
  process.exit(1);
}

const env = {};
for (const line of fs.readFileSync(envPath, "utf8").replace(/\r/g, "").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const i = trimmed.indexOf("=");
  if (i < 0) continue;
  env[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
}

const token = env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.log("\n❌ TELEGRAM_BOT_TOKEN is empty in .env.local");
  console.log("\nSteps:");
  console.log("  1. Open Telegram → search @BotFather");
  console.log("  2. Send /newbot and follow prompts");
  console.log("  3. Copy the token into .env.local");
  console.log("  4. Open YOUR bot in Telegram and tap Start");
  console.log("  5. Run this script again\n");
  process.exit(1);
}

console.log("\n🔍 Checking Telegram bot...\n");

const updatesRes = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const updates = await updatesRes.json();

if (!updates.ok) {
  console.error("❌ Bot token invalid:", updates.description);
  console.log("\nGet a new token from @BotFather if needed.\n");
  process.exit(1);
}

const chatIds = new Map();
for (const item of updates.result ?? []) {
  const chat = item.message?.chat ?? item.my_chat_member?.chat;
  if (chat?.id) {
    chatIds.set(chat.id, chat.first_name ?? chat.title ?? "Unknown");
  }
}

if (chatIds.size === 0) {
  console.log("❌ No messages found yet.\n");
  console.log("Do this first:");
  console.log("  1. Open Telegram on your phone");
  console.log("  2. Search for YOUR bot (the one you created)");
  console.log("  3. Tap Start and send any message (e.g. hi)");
  console.log("  4. Run: node scripts/telegram-setup.mjs\n");
  process.exit(1);
}

console.log("✅ Found chat(s):\n");
for (const [id, name] of chatIds) {
  console.log(`   Chat ID: ${id}  (${name})`);
}

const firstChatId = [...chatIds.keys()][0];

// Save to .env.local
let envContent = fs.readFileSync(envPath, "utf8");
if (envContent.includes("TELEGRAM_CHAT_ID=")) {
  envContent = envContent.replace(/TELEGRAM_CHAT_ID=.*/, `TELEGRAM_CHAT_ID=${firstChatId}`);
} else {
  envContent += `\nTELEGRAM_CHAT_ID=${firstChatId}\n`;
}
fs.writeFileSync(envPath, envContent, "utf8");

console.log(`\n✅ Automatically updated .env.local with TELEGRAM_CHAT_ID=${firstChatId}\n`);

// Test send
const testRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: firstChatId,
    text: "✅ The Mood Bridge is connected! Hugs and moods will appear here. 💕",
  }),
});
const test = await testRes.json();

if (test.ok) {
  console.log("✅ Test message sent! Check Telegram on your phone.\n");
  console.log("Next: save .env.local, restart dev server (Ctrl+C → npm run dev)\n");
} else {
  console.log("❌ Test send failed:", test.description, "\n");
}
