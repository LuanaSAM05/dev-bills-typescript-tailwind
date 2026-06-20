"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const authMiddleware = async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return reply.code(401).send({
            error: "Token de autorização não fornecido",
        });
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(token);
        request.userId = decodedToken.uid;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        request.log.error("Erro ao verificar token: " + message);
        return reply.code(401).send({
            error: "Token inválido ou expirado",
        });
    }
};
exports.authMiddleware = authMiddleware;
