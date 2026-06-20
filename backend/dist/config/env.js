"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(3001),
    DATABASE_URL: zod_1.z
        .string()
        .min(5, "DATABASE_URL é obrigatório"),
    NODE_ENV: zod_1.z.enum(["dev", "prod", "test"], {
        message: "NODE_ENV deve ser 'dev', 'prod' ou 'test'",
    }),
    // FIREBASE
    FIREBASE_PROJECT_ID: zod_1.z.string().optional(),
    FIREBASE_PRIVATE_KEY: zod_1.z.string().optional(),
    FIREBASE_CLIENT_EMAIL: zod_1.z.string().optional(),
});
exports.env = envSchema.parse(process.env);
