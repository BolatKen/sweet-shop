import express from "express";
import prisma from "../lib/prisma";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.get('/', async (req, res) => {
    const { 
        search,
        category,
        sortBy,
        order,
        page,
        limit,
    } = req.query

    const pageNum = Number(page) || 1
    const limitNum = Number(limit) || 12
    const skip = (pageNum - 1) * limitNum

    const products = await prisma.product.findMany({
        where: {
        isActive: true,
        ...(search ? {
            name: { contains: search as string, mode: 'insensitive' }
        } : {}),
        ...(category ? { categoryId: category as string } : {}),
        },
        include: { variants: true },
        orderBy: sortBy === 'price'
        ? { variants: { _count: order === 'desc' ? 'desc' : 'asc' } }
        : { createdAt: order === 'desc' ? 'desc' : 'asc' },
        skip,
        take: limitNum,
    })

    const total = await prisma.product.count({
        where: {
        isActive: true,
        ...(search ? {
            name: { contains: search as string, mode: 'insensitive' }
        } : {}),
        ...(category ? { categoryId: category as string } : {}),
        }
    })


    res.json({
        products,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
    })
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

router.post('/:id/variants', authenticateToken, async (req, res) => {
    const productId = req.params.id;
    const data = req.body;
    const createdProductVariant = await prisma.productVariant.create( {
        data: { ...data, productId}
    })
    res.json(createdProductVariant);
})

router.delete('/:id/variants/:variantId', authenticateToken, async (req, res) => {
    const variantId = req.params.variantId as string;
    const deletedProductVariant = await prisma.productVariant.delete({
        where: { id: variantId }
    })
    res.json(deletedProductVariant);
})

router.patch('/:id', authenticateToken, async (req, res) => {
  const id = req.params.id as string
  const data = req.body
  const updatedProduct = await prisma.product.update({
    where: { id },
    data
  })
  res.json(updatedProduct)
})

router.delete('/:id', authenticateToken, async (req, res) => {
  const id = req.params.id as string
  const deletedProduct = await prisma.product.delete({
    where: { id }
  })
  res.json(deletedProduct)
})



export default router;