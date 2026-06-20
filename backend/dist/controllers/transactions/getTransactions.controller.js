"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const prisma_js_1 = __importDefault(require("../../config/prisma.js"));
dayjs_1.default.extend(utc_1.default);
const getTransactions = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        return reply.status(401).send({
            error: "Usuário não autenticado",
        });
    }
    const { month, year, type, categoryId } = request.query;
    const filters = { userId };
    if (month && year) {
        const startDate = dayjs_1.default.utc(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs_1.default.utc(startDate).endOf("month").toDate();
        filters.date = { gte: startDate, lte: endDate };
    }
    if (type) {
        filters.type = type;
    }
    if (categoryId) {
        filters.categoryId = categoryId;
    }
    try {
        const transactions = await prisma_js_1.default.transaction.findMany({
            where: filters,
            include: {
                category: {
                    select: {
                        color: true,
                        name: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
        return reply.send(transactions);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        request.log.error("Erro ao trazer transações: " + message);
        return reply.status(500).send({
            error: "Erro do servidor",
        });
    }
};
exports.getTransactions = getTransactions;
