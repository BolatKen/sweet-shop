"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const { search, category, sortBy, order, page, limit, } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skip = (pageNum - 1) * limitNum;
    const products = await prisma_1.default.product.findMany({
        where: {
            isActive: true,
            ...(search ? {
                name: { contains: search, mode: 'insensitive' }
            } : {}),
            ...(category ? { categoryId: category } : {}),
        },
        include: { variants: true },
        orderBy: sortBy === 'price'
            ? { variants: { _count: order === 'desc' ? 'desc' : 'asc' } }
            : { createdAt: order === 'desc' ? 'desc' : 'asc' },
        skip,
        take: limitNum,
    });
    const total = await prisma_1.default.product.count({
        where: {
            isActive: true,
            ...(search ? {
                name: { contains: search, mode: 'insensitive' }
            } : {}),
            ...(category ? { categoryId: category } : {}),
        }
    });
    res.json({
        products,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
    });
});
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    const product = await prisma_1.default.product.findUnique({
        where: { slug },
        include: { variants: true }
    });
    res.json(product);
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    const data = req.body;
    const createdProduct = await prisma_1.default.product.create({
        data
    });
    res.json(createdProduct);
});
router.post('/:id/variants', auth_1.authenticateToken, async (req, res) => {
    const productId = req.params.id;
    const data = req.body;
    const createdProductVariant = await prisma_1.default.productVariant.create({
        data: { ...data, productId }
    });
    res.json(createdProductVariant);
});
router.delete('/:id/variants/:variantId', auth_1.authenticateToken, async (req, res) => {
    const variantId = req.params.variantId;
    const deletedProductVariant = await prisma_1.default.productVariant.delete({
        where: { id: variantId }
    });
    res.json(deletedProductVariant);
});
router.patch('/:id', auth_1.authenticateToken, async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const updatedProduct = await prisma_1.default.product.update({
        where: { id },
        data
    });
    res.json(updatedProduct);
});
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    const id = req.params.id;
    const deletedProduct = await prisma_1.default.product.delete({
        where: { id }
    });
    res.json(deletedProduct);
});
exports.default = router;
