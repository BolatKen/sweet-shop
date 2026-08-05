"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/stats', auth_1.authenticateToken, async (req, res) => {
    const [products, orders, users] = await Promise.all([
        prisma_1.default.product.count(),
        prisma_1.default.order.count(),
        prisma_1.default.user.count()
    ]);
    res.json({ products, orders, users });
});
router.get('/orders', auth_1.authenticateToken, async (req, res) => {
    const orders = await prisma_1.default.order.findMany({
        include: {
            user: true,
            items: true
        }
    });
    res.json(orders);
});
router.patch('/orders/:id', auth_1.authenticateToken, async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const updated = await prisma_1.default.order.update({
        where: { id },
        data: { status }
    });
    res.json(updated);
});
router.get('/users', auth_1.authenticateToken, async (req, res) => {
    const users = await prisma_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        }
    });
    res.json(users);
});
router.patch('/users/:id', auth_1.authenticateToken, async (req, res) => {
    const id = req.params.id;
    const { role } = req.body;
    const updated = await prisma_1.default.user.update({
        where: { id },
        data: { role }
    });
    res.json(updated);
});
exports.default = router;
