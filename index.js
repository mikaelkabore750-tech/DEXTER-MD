/**
 *  FIXED INDEX.JS – Compatible Render, Katabump, Bot-hosting
 *  Sans Mega, utilise ton SESSION_ID base64
 */

const fs = require("fs");
const path = require("path");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const config = require("./config");

// ====== 1. Préparation du dossier session ======
const SESSION_DIR = path.join(__dirname, "session");

if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR);
    console.log("📁 Dossier 'session' créé.");
}

// ====== 2. Création automatique des fichiers auth Baileys ======
if (config.SESSION_ID) {
    try {
        const authData = JSON.parse(Buffer.from(config.SESSION_ID, "base64").toString());

        fs.writeFileSync(path.join(SESSION_DIR, "creds.json"), JSON.stringify(authData, null, 2));
        console.log("🔑 SESSION_ID chargé dans creds.json");
    } catch (err) {
        console.error("❌ SESSION_ID invalide !");
    }
}

// ====== 3. Chargement de Baileys ======
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    console.log("🤖 Bot connecté !");
}

startBot();
