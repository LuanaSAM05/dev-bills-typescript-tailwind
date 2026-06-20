"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../config/prisma.js"));
const transaction_schema_js_1 = require("../../schemas/transaction.schema.js");
const createTransaction = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }
    const result = transaction_schema_js_1.createTransactionSchema.safeParse(request.body);
    if (!result.success) {
        const firstError = result.error.issues[0];
        reply.status(400).send({
            error: firstError?.message || "Dados de transação inválidos",
            details: result.error.issues,
        });
        return;
    }
    const transaction = result.data;
    try {
        const category = await prisma_js_1.default.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            },
        });
        if (!category) {
            reply.status(400).send({
                error: "Categoria inválida para o tipo de transação",
            });
            return;
        }
        const newTransaction = await prisma_js_1.default.transaction.create({
            data: {
                ...transaction,
                userId,
                date: transaction.date, // já vem como Date por causa do z.coerce.date()
            },
            include: {
                category: true,
            },
        });
        reply.status(201).send(newTransaction);
    }
    catch (error) {
        request.log.error(error);
        reply.status(500).send({
            error: "Erro interno do servidor",
        });
    }
};
exports.default = createTransaction;
