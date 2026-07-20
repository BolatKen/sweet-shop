import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/stats', authenticateToken, async (req, res) => {

    const [products, orders, users] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count()
    ])

    res.json({ products, orders, users})
})

router.get('/orders', authenticateToken, async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true
    }
  })
  res.json(orders)
})

router.patch('/orders/:id', authenticateToken, async (req, res) => {
  const id = req.params.id as string
  const { status } = req.body
  const updated = await prisma.order.update({
    where: { id },
    data: { status }
  })
  res.json(updated)
})


router.get('/users', authenticateToken, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    }
  })
  res.json(users)
})

router.patch('/users/:id', authenticateToken, async (req, res) => {
  const id = req.params.id as string
  const { role } = req.body
  const updated = await prisma.user.update({
    where: { id },
    data: { role }
  })
  res.json(updated)
})

export default router;