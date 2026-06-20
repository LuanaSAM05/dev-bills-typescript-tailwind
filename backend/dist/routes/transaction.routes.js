"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_to_json_schema_1 = require("zod-to-json-schema");
const createTransaction_controller_js_1 = __importDefault(require("../controllers/transactions/createTransaction.controller.js"));
const deleteTransaction_controller_js_1 = require("../controllers/transactions/deleteTransaction.controller.js");
const getTransactions_controller_js_1 = require("../controllers/transactions/getTransactions.controller.js");
const getTransactionsSummary_controller_js_1 = require("../controllers/transactions/getTransactionsSummary.controller.js");
const transaction_schema_js_1 = require("../schemas/transaction.schema.js");
const auth_middlewares_js_1 = require("../middlewares/auth.middlewares.js");
const getHistoricalTransactions_controller_js_1 = require("../controllers/transactions/getHistoricalTransactions.controller.js");
const transactionRoutes = async (fastify) => {
    fastify.addHook('preHandler', auth_middlewares_js_1.authMiddleware);
    // Criacao
    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: (0, zod_to_json_schema_1.zodToJsonSchema)(transaction_schema_js_1.createTransactionSchema),
        },
        handler: createTransaction_controller_js_1.default,
    });
    // Buscar com filtros
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: (0, zod_to_json_schema_1.zodToJsonSchema)(transaction_schema_js_1.getTransactionsSchema),
        },
        handler: getTransactions_controller_js_1.getTransactions,
    });
    // Buscar resumo
    fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: (0, zod_to_json_schema_1.zodToJsonSchema)(transaction_schema_js_1.getTransactionsSummarySchema),
        },
        handler: getTransactionsSummary_controller_js_1.getTransactionsSummary,
    });
    // Historico de transacoes
    fastify.route({
        method: "GET",
        url: "/historical",
        schema: {
            querystring: (0, zod_to_json_schema_1.zodToJsonSchema)(transaction_schema_js_1.getHistoricalTransactionsSchema),
        },
        handler: getHistoricalTransactions_controller_js_1.getHistoricalTransactions,
    });
    // Deletar
    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: (0, zod_to_json_schema_1.zodToJsonSchema)(transaction_schema_js_1.deleteTransactionSchema),
        },
        handler: deleteTransaction_controller_js_1.deleteTransaction,
    });
};
exports.default = transactionRoutes;
