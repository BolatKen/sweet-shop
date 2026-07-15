import express from "express";
import prisma from "../lib/prisma";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
});

router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    const product = await prisma.product.findUnique({
        where: {slug},
        include: {variants: true}
    });
    res.json(product);
});


router.post('/', authenticateToken, async (req, res) => {
    const data = req.body;
    const createdProduct = await prisma.product.create({
        data
    })
    res.json(createdProduct);
});



export default router;