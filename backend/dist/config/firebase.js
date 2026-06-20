"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const env_1 = require("./env");
const initializeFirebaseAdmin = () => {
    if (firebase_admin_1.default.apps.length > 0)
        return;
    const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } = env_1.env;
    if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID) {
        throw new Error("🚨 Falha ao iniciar Firebase - Faltando as credenciais");
    }
    try {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: FIREBASE_PROJECT_ID,
                clientEmail: FIREBASE_CLIENT_EMAIL,
                privateKey: FIREBASE_PRIVATE_KEY,
            })
        });
    }
    catch (error) {
        console.error("🚨 Falha ao conectar ao Firebase", error);
        process.exit(1);
    }
};
exports.default = initializeFirebaseAdmin;
