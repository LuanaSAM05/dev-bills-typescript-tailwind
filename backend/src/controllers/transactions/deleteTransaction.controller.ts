import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import type { DeleteTransactionsParams } from "../../schemas/transaction.schema.js";

export const deleteTransaction = async (
  request: FastifyRequest<{ Params: DeleteTransactionsParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;
  const { id } = request.params;

  if (!userId) {
    reply.status(401).send({ error: "Usuário não autenticado" });
    return;
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      reply.status(404).send({ error: "ID da transação não encontrada" });
      return;
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    reply.status(204).send({ message: "Transação deletada com sucesso" });
  } catch (error) {
    request.log.error({ message: "Erro ao deletar transação", error });
    reply.status(500).send({ error: "Erro do servidor, falha ao deletar transação" });
  }
};
