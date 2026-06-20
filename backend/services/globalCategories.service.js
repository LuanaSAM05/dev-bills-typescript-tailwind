"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGlobalCategories = void 0;
const client_1 = require("@prisma/client");
const prisma_js_1 = __importDefault(require("../src/config/prisma.js"));
const globalCategories = [
    // Despesas
    { name: "Alimentação", color: "#FF5733", type: client_1.TransactionType.EXPENSE },
    { name: "Transporte", color: "#33A8FF", type: client_1.TransactionType.EXPENSE },
    { name: "Moradia", color: "#33FF57", type: client_1.TransactionType.EXPENSE },
    { name: "Saúde", color: "#F033FF", type: client_1.TransactionType.EXPENSE },
    { name: "Educação", color: "#FF3366", type: client_1.TransactionType.EXPENSE },
    { name: "Lazer", color: "#FFBA33", type: client_1.TransactionType.EXPENSE },
    { name: "Compras", color: "#33FFF6", type: client_1.TransactionType.EXPENSE },
    { name: "Outros", color: "#B033FF", type: client_1.TransactionType.EXPENSE },
    // Receitas
    { name: "Salário", color: "#33FF57", type: client_1.TransactionType.INCOME },
    { name: "Freelance", color: "#33A8FF", type: client_1.TransactionType.INCOME },
    { name: "Investimentos", color: "#FFBA33", type: client_1.TransactionType.INCOME },
    { name: "Outros", color: "#B033FF", type: client_1.TransactionType.INCOME },
];
const initializeGlobalCategories = async () => {
    const createdCategories = [];
    for (const category of globalCategories) {
        try {
            const existing = await prisma_js_1.default.category.findFirst({
                where: {
                    name: category.name,
                    type: category.type,
                },
            });
            if (!existing) {
                const newCategory = await prisma_js_1.default.category.create({
                    data: category,
                });
                console.log(`Criada: ${newCategory.name}`);
                createdCategories.push(newCategory);
            }
            else {
                createdCategories.push(existing);
            }
        }
        catch (error) {
            console.error("Erro ao criar categoria", error);
        }
    }
    console.log("Todas as categorias inicializadas");
    return createdCategories;
};
exports.initializeGlobalCategories = initializeGlobalCategories;
