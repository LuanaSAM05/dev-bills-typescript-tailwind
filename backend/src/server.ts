import { initializeGlobalCategories }  from "../services/globalCategories.service.js";
import app from "./app.js";
import { env } from "./config/env.js";
import initializeFirebaseAdmin from "./config/firebase.js";
import { prismaConnect } from "./config/prisma.js";

const PORT = env.PORT;

initializeFirebaseAdmin();

const startServer = async () => {
  try {
    await prismaConnect();

    await initializeGlobalCategories();

    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Servidor rodando na porta ${PORT}`);
  } catch (error) {
    console.error(error);
  }
};

startServer();