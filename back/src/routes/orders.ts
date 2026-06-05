// POST / — создать заказ из корзины
// GET / — история заказов юзера
// GET /:id — один заказ

// Все три защищены authenticateToken. 
import express from 'express';
import prisma from '../lib/prisma';
import {authenticateToken} from '../middleware/auth';

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
    const data = req.body;
    const createdOrder = await prisma.order.create({ data });
    res.json(createdOrder);
});

router.get("/", authenticateToken, async (req, res) => {
    const userId = (req as any).user.id;
    const orders = await prisma.order.findMany({
        where: {userId}
    });
    res.json(orders);
});

router.get("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id as string;
    const userOrders = await prisma.order.findUnique({
        where : {id}
    }) 
    res.json(userOrders);
});

export default router;