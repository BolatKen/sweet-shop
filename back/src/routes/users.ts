import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/me', authenticateToken, async (req, res) => {
    const userId = (req as any).user.id;
    const userInfo = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            orders: {
                include: {
                    items: {
                    include: {
                        variant: {
                        include: {
                            product: true
                        }
                        }
                    }
                    }
                }
                }
        }
    });
    res.json(userInfo);
})

export default router;