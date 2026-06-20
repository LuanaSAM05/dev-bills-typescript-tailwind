"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalCategories_service_js_1 = require("../services/globalCategories.service.js");
const app_js_1 = __importDefault(require("./app.js"));
const env_js_1 = require("./config/env.js");
const firebase_js_1 = __importDefault(require("./config/firebase.js"));
const prisma_js_1 = require("./config/prisma.js");
const PORT = env_js_1.env.PORT;
(0, firebase_js_1.default)();
const startServer = async () => {
    try {
        await (0, prisma_js_1.prismaConnect)();
        await (0, globalCategories_service_js_1.initializeGlobalCategories)();
        await app_js_1.default.listen({
            port: PORT,
            host: "0.0.0.0",
        });
        console.log(`Servidor rodando na porta ${PORT}`);
    }
    catch (error) {
        console.error(error);
    }
};
startServer();
