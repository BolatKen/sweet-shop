"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const cartItems = await prisma_1.default.cartItem.findMany({
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
router.post("/", auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { variantId, quantity } = req.body;
    const existing = await prisma_1.default.cartItem.findFirst({
        where: { userId, variantId }
    });
    if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity <= 0) {
            await prisma_1.default.cartItem.delete({
                where: { id: existing.id }
            });
            return res.json({ deleted: true, id: existing.id });
        }
        const updated = await prisma_1.default.cartItem.update({
            where: { id: existing.id },
            data: { quantity: newQuantity }
        });
        return res.json(updated);
    }
    if (quantity <= 0) {
        return res.status(400).json({ error: "Cannot add zero or negative quantity" });
    }
    const createdCartItem = await prisma_1.default.cartItem.create({
        data: {
            userId,
            variantId,
            quantity
        }
    });
    res.json(createdCartItem);
});
router.delete("/:id", auth_1.authenticateToken, async (req, res) => {
    const id = req.params.id;
    const deletedCartItem = await prisma_1.default.cartItem.delete({
        where: { id },
    });
    res.json(deletedCartItem);
});
exports.default = router;
