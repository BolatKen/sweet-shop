import express from 'express';
import prisma from '../lib/prisma';
import {authenticateToken} from '../middleware/auth';

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  const userId = (req as any).user.id
  const { deliveryAddress, total, items } = req.body

  const order = await prisma.order.create({
    data: {
      userId,
      deliveryAddress,
      total,
      items: {
        create: items.map((item: any) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.variant.price
        }))
      }
    }
  })

  await prisma.cartItem.deleteMany({
    where: { userId }
  })

  res.json(order)
})

router.get("/", authenticateToken, async (req, res) => {
    const userId = (req as any).user.id;
    const orders = await prisma.order.findMany({
        where: {userId}
    });
    res.json(orders);
});

router.get("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id as string
    const userId = (req as any).user.id
    
    const order = await prisma.order.findFirst({
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
    })
    
    if (!order) {
        return res.status(404).json({ error: "Order not found" })
    }
    
    res.json(order)
})

export default router;