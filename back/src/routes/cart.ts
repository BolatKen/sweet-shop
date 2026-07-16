import express from "express";
import prisma from "../lib/prisma";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
    const userId = (req as any).user.id
    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
            variant: {
                include: {
                    product: true
                }
            }
        }
    });
    res.json(cartItems);
});

router.post("/", authenticateToken, async (req, res) => {
    const userId = (req as any).user.id
    const { variantId, quantity } = req.body
    const createdCartItem = await prisma.cartItem.create({
        data: {
            userId,
            variantId,
            quantity
        }
    });
    res.json(createdCartItem);
});

router.delete("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id as string;
    const deletedProduct = await prisma.cartItem.delete({
        where: { id }
    });
    res.json(deletedProduct);
});

export default router;