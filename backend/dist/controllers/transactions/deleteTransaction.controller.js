"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = void 0;
const prisma_js_1 = __importDefault(require("../../config/prisma.js"));
const deleteTransaction = async (request, reply) => {
    const userId = request.userId;
    const { id } = request.params;
    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }
    try {
        const transaction = await prisma_js_1.default.transaction.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!transaction) {
            reply.status(404).send({ error: "ID da transação não encontrada" });
            return;
        }
        await prisma_js_1.default.transaction.delete({
            where: {
                id,
            },
        });
        reply.status(204).send({ message: "Transação deletada com sucesso" });
    }
    catch (error) {
        request.log.error({ message: "Erro ao deletar transação", error });
        reply.status(500).send({ error: "Erro do servidor, falha ao deletar transação" });
    }
};
exports.deleteTransaction = deleteTransaction;
