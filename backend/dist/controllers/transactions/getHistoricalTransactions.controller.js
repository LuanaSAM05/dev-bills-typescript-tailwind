"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoricalTransactions = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const prisma_js_1 = __importDefault(require("../../config/prisma.js"));
require("dayjs/locale/pt-br");
dayjs_1.default.locale("pt-br");
dayjs_1.default.extend(utc_1.default);
const getHistoricalTransactions = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }
    const { month, year, months = 6 } = request.query;
    const baseDate = new Date(year, month - 1, 1);
    const startDate = dayjs_1.default
        .utc(baseDate)
        .subtract(months - 1, "month")
        .startOf("month")
        .toDate();
    const endDate = dayjs_1.default.utc(baseDate).endOf("month").toDate();
    try {
        const transactions = await prisma_js_1.default.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                amount: true,
                type: true,
                date: true,
            },
        });
        const monthlyData = Array.from({ length: months }, (_, i) => {
            const date = dayjs_1.default
                .utc(baseDate)
                .subtract(months - 1 - i, "month");
            return {
                name: date.format("MMM/YYYY"),
                income: 0,
                expenses: 0,
            };
        });
        transactions.forEach((transaction) => {
            const monthKey = dayjs_1.default.utc(transaction.date).format("MMM/YYYY");
            const monthData = monthlyData.find((month) => month.name === monthKey);
            if (monthData) {
                if (transaction.type === "INCOME") {
                    monthData.income += transaction.amount;
                }
                else {
                    monthData.expenses += transaction.amount;
                }
            }
        });
        reply.send({
            history: monthlyData,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        request.log.error(`Erro ao buscar histórico: ${message}`);
        reply.status(500).send({
            error: "Erro interno do servidor",
        });
    }
};
exports.getHistoricalTransactions = getHistoricalTransactions;
