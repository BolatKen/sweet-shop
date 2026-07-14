import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get("/", async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
});

router.get("/:slug", async (req,res) => {
    const slug = req.params.slug;
    const category = await prisma.category.findUnique({
        where: {slug}
    });
    res.json(category)
});

router.post("/", authenticateToken, async (req, res) => {
    const data = req.body;
    const createdCategory = await prisma.category.create({
        data
    });
    res.json(createdCategory);
});

export default router;