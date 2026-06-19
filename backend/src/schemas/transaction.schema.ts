import { ObjectId } from "mongodb";
import { z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

/**
 * CREATE TRANSACTION
 */
export const createTransactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),

  amount: z.number().positive("O valor deve ser positivo"),

  date: z.coerce.date(),

  categoryId: z.string().refine(isValidObjectId, {
    message: "ID de categoria inválido",
  }),

  type: z.enum(["INCOME", "EXPENSE"]),
});

/**
 * GET TRANSACTIONS
 */
export const getTransactionsSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),

  type: z.enum(["INCOME", "EXPENSE"]).optional(),

  categoryId: z
    .string()
    .refine(isValidObjectId, {
      message: "ID de categoria inválido",
    })
    .optional(),
});

/**
 * SUMMARY
 */
export const getTransactionsSummarySchema = z.object({
  month: z.string().min(1, "O mês é obrigatório"),
  year: z.string().min(1, "O ano é obrigatório"),
});

/**
 * HISTORICAL
 */
export const getHistoricalTransactionsSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  months: z.coerce.number().min(1).max(12).optional(),
});

/**
 * DELETE
 */
export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, {
    message: "ID inválido",
  }),
});

/**
 * TYPES
 */
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSummarySchema>;
export type DeleteTransactionsParams = z.infer<typeof deleteTransactionSchema>;
export type GetHistoricalTransactionsQuery = z.infer<typeof getHistoricalTransactionsSchema>;