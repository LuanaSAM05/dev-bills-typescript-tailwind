"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_routes_js_1 = __importDefault(require("./category.routes.js"));
const transaction_routes_js_1 = __importDefault(require("./transaction.routes.js"));
async function routes(fastify) {
    fastify.get("/health", async () => {
        return {
            status: "Ok",
            message: "DevBills API rodando normalmente",
        };
    });
    fastify.register(category_routes_js_1.default, { prefix: "/categories" });
    fastify.register(transaction_routes_js_1.default, { prefix: "/transactions" });
}
exports.default = routes;
