"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsSummary = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const prisma_js_1 = __importDefault(require("../../config/prisma.js"));
dayjs_1.default.extend(utc_1.default);
const getTransactionsSummary = async (request, reply) => {
    const userId = "KFF$DFJCKJ%"; // ⚠️ depois substituir por auth real
    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }
    const { month, year } = request.query;
    if (!month || !year) {
        reply.status(400).send({ error: "O mês e ano são obrigatórios para o resumo" });
        return;
    }
    const startDate = dayjs_1.default.utc(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs_1.default.utc(startDate).endOf("month").toDate();
    try {
        const transactions = await prisma_js_1.default.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                category: true,
            },
        });
        let totalExpenses = 0;
        let totalIncomes = 0;
        const groupedExpenses = new Map();
        for (const transaction of transactions) {
            if (transaction.type === client_1.TransactionType.EXPENSE) {
                const existing = groupedExpenses.get(transaction.categoryId) ?? {
                    categoryId: transaction.categoryId,
                    categoryName: transaction.category.name,
                    categoryColor: transaction.category.color,
                    totalAmount: 0,
                    percentage: 0,
                };
                existing.totalAmount += transaction.amount;
                groupedExpenses.set(transaction.categoryId, existing);
                totalExpenses += transaction.amount;
            }
            else {
                totalIncomes += transaction.amount;
            }
        }
        const summary = {
            totalExpenses,
            totalIncome: totalIncomes,
            balance: Math.round((totalIncomes - totalExpenses) * 100) / 100,
            expensesByCategory: Array.from(groupedExpenses.values())
                .map((entry) => ({
                ...entry,
                percentage: Number.parseFloat(((entry.totalAmount / totalExpenses) * 100).toFixed(2)),
            }))
                .sort((a, b) => b.totalAmount - a.totalAmount),
        };
        reply.send(summary);
    }
    catch (err) {
        request.log.error(err, "Erro ao trazer transações");
        reply.status(500).send({
            error: "Erro do servidor",
        });
    }
};
exports.getTransactionsSummary = getTransactionsSummary;
