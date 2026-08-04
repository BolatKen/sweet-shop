"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const categories = await prisma_1.default.category.findMany();
    res.json(categories);
});
router.get("/:slug", async (req, res) => {
    const slug = req.params.slug;
    const category = await prisma_1.default.category.findUnique({
        where: { slug }
    });
    res.json(category);
});
router.post("/", auth_1.authenticateToken, async (req, res) => {
    const data = req.body;
    const createdCategory = await prisma_1.default.category.create({
        data
    });
    res.json(createdCategory);
});
router.patch('/:id', auth_1.authenticateToken, async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const updatedCategory = await prisma_1.default.product.update({
        where: { id },
        data
    });
    res.json(updatedCategory);
});
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    const id = req.params.id;
    const deletedCategory = await prisma_1.default.category.delete({
        where: { id }
    });
    res.json(deletedCategory);
});
exports.default = router;
