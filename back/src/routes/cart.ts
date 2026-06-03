// GET /api/cart — корзина текущего юзера
// POST /api/cart — добавить товар
// DELETE /api/cart/:id — удалить из корзины

// Все три роута должны быть защищены authenticateToken — корзина только для авторизованных.
import express from "express";
import prisma from "../lib/prisma";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
    const userId = (req as any).user.id
    const products = await prisma.cartItem.findMany({
        where: {userId: userId}
    });
    res.json(products);
});

router.post("/", authenticateToken, async (req, res) => {
    const data = req.body;
    const createdCartItem = await prisma.cartItem.create({
        data
    });
    res.json(createdCartItem);
});

router.delete("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    const deletedProduct = await prisma.cartItem.delete({
        where: { id }
    });
    res.json(deletedProduct);
});

export default router;