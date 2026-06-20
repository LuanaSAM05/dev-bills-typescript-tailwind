"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_process_1 = require("node:process");
const fastify_1 = __importDefault(require("fastify"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const cors_1 = __importDefault(require("@fastify/cors"));
const app = (0, fastify_1.default)({
    logger: {
        level: node_process_1.env.NODE_ENV === "dev" ? "info" : "error",
    },
});
app.register(cors_1.default, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
});
app.register(index_js_1.default, { prefix: "/api" });
exports.default = app;
