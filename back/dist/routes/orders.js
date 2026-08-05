"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/", auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { deliveryAddress, total, items } = req.body;
    const order = await prisma_1.default.order.create({
        data: {
            userId,
            deliveryAddress,
            total,
            items: {
                create: items.map((item) => ({
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.variant.price
                }))
            }
        }
    });
    await prisma_1.default.cartItem.deleteMany({
        where: { userId }
    });
    res.json(order);
});
router.get("/", auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const orders = await prisma_1.default.order.findMany({
        where: { userId }
    });
    res.json(orders);
});
router.get("/:id", auth_1.authenticateToken, async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    const order = await prisma_1.default.order.findFirst({
        where: {
            id: id,
            userId: userId
        },
        include: {
            items: {
                include: {
                    variant: {
                        include: { product: true }
                    }
                }
            }
        }
    });
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
});
exports.default = router;
