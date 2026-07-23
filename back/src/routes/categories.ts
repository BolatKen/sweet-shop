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

router.patch('/:id', authenticateToken, async (req, res) => {
  const id = req.params.id as string
  const data = req.body
  const updatedCategory = await prisma.product.update({
    where: { id },
    data
  })
  res.json(updatedCategory)
})

router.delete('/:id', authenticateToken, async (req, res) => {
  const id = req.params.id as string
  const deletedCategory = await prisma.category.delete({
    where: { id }
  })
  res.json(deletedCategory)
})

export default router;