import type { FastifyReply, FastifyRequest } from "fastify";
import type z from "zod";
import prisma from "../../config/prisma.js";
import { createTransactionSchema } from "../../schemas/transaction.schema.js";

const createTransaction = async (
  request: FastifyRequest<{ Body: z.infer<typeof createTransactionSchema> }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId; 
  if (!userId) {
    reply.status(401).send({ error: "Usuário não autenticado" });
    return;
  }

  const result = createTransactionSchema.safeParse(request.body);

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
    const category = await prisma.category.findFirst({
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

    const newTransaction = await prisma.transaction.create({
      data: {
        userId,
        date: transaction.date,
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
      },
      include: {
        category: true,
      },
    });

    reply.status(201).send(newTransaction);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({
      error: "Erro interno do servidor",
    });
  }
};

export default createTransaction;