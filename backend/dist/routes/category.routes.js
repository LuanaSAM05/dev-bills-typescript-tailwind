"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_controller_js_1 = require("../controllers/categories/category.controller.js");
const auth_middlewares_js_1 = require("../middlewares/auth.middlewares.js");
const categoryRoutes = async (fastify) => {
    fastify.addHook("preHandler", auth_middlewares_js_1.authMiddleware);
    fastify.get("/", category_controller_js_1.getCategories);
};
exports.default = categoryRoutes;
