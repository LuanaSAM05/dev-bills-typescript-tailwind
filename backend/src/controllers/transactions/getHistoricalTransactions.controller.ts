import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetHistoricalTransactionsQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");
dayjs.extend(utc);

type HistoricalTransaction = {
  amount: number;
  type: string;
  date: Date;
};

export const getHistoricalTransactions = async (
  request: FastifyRequest<{ Querystring: GetHistoricalTransactionsQuery }>,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "Usuário não autenticado" });
    return;
  }

  const { month, year, months = 6 } = request.query;

  const baseDate = new Date(year, month - 1, 1);

  const startDate = dayjs
    .utc(baseDate)
    .subtract(months - 1, "month")
    .startOf("month")
    .toDate();

  const endDate = dayjs.utc(baseDate).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
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
      const date = dayjs
        .utc(baseDate)
        .subtract(months - 1 - i, "month");

      return {
        name: date.format("MMM/YYYY"),
        income: 0,
        expenses: 0,
      };
    });

    (transactions as HistoricalTransaction[]).forEach((transaction) => {
      const monthKey = dayjs.utc(transaction.date).format("MMM/YYYY");

      const monthData = monthlyData.find(
        (month) => month.name === monthKey
      );

      if (monthData) {
        if (transaction.type === "INCOME") {
          monthData.income += transaction.amount;
        } else {
          monthData.expenses += transaction.amount;
        }
      }
    });

    reply.send({
      history: monthlyData,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);

    request.log.error(`Erro ao buscar histórico: ${message}`);

    reply.status(500).send({
      error: "Erro interno do servidor",
    });
  }
};