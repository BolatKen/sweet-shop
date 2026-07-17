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

    const existing = await prisma.cartItem.findFirst({
        where: { userId, variantId }
    })

    if (existing) {
        const newQuantity = existing.quantity + quantity
        if (newQuantity <= 0) {
            await prisma.cartItem.delete({
                where: {id: existing.id}
            })
            return res.json({ deleted: true, id: existing.id })
        }

        const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity }
        })
        return res.json(updated)
    }
        if (quantity <= 0) {
            return res.status(400).json({ error: "Cannot add zero or negative quantity" })
        }
  
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
    const deletedCartItem = await prisma.cartItem.delete({
        where: { id },

    });
    res.json(deletedCartItem);
});

export default router;