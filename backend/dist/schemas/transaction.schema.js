"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransactionSchema = exports.getHistoricalTransactionsSchema = exports.getTransactionsSummarySchema = exports.getTransactionsSchema = exports.createTransactionSchema = void 0;
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
const isValidObjectId = (id) => mongodb_1.ObjectId.isValid(id);
/**
 * CREATE TRANSACTION
 */
exports.createTransactionSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, "Descrição é obrigatória"),
    amount: zod_1.z.number().positive("O valor deve ser positivo"),
    date: zod_1.z.coerce.date(),
    categoryId: zod_1.z.string().refine(isValidObjectId, {
        message: "ID de categoria inválido",
    }),
    type: zod_1.z.enum(["INCOME", "EXPENSE"]),
});
/**
 * GET TRANSACTIONS
 */
exports.getTransactionsSchema = zod_1.z.object({
    month: zod_1.z.string().optional(),
    year: zod_1.z.string().optional(),
    type: zod_1.z.enum(["INCOME", "EXPENSE"]).optional(),
    categoryId: zod_1.z
        .string()
        .refine(isValidObjectId, {
        message: "ID de categoria inválido",
    })
        .optional(),
});
/**
 * SUMMARY
 */
exports.getTransactionsSummarySchema = zod_1.z.object({
    month: zod_1.z.string().min(1, "O mês é obrigatório"),
    year: zod_1.z.string().min(1, "O ano é obrigatório"),
});
/**
 * HISTORICAL
 */
exports.getHistoricalTransactionsSchema = zod_1.z.object({
    month: zod_1.z.coerce.number().min(1).max(12),
    year: zod_1.z.coerce.number().min(2000).max(2100),
    months: zod_1.z.coerce.number().min(1).max(12).optional(),
});
/**
 * DELETE
 */
exports.deleteTransactionSchema = zod_1.z.object({
    id: zod_1.z.string().refine(isValidObjectId, {
        message: "ID inválido",
    }),
});
