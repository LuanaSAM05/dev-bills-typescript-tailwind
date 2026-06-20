"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaConnect = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const prismaConnect = async () => {
    try {
        await prisma.$connect();
        console.log("Conectado ao banco de dados com sucesso!");
    }
    catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
    }
};
exports.prismaConnect = prismaConnect;
exports.default = prisma;
